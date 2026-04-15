const fs = require('fs');
const path = require('path');

// Using manual recursion for zero dependencies
function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

const directoryPath = path.join(__dirname, 'app');

walkSync(directoryPath, function (filePath) {
    if (filePath.endsWith('page.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Skip layout.tsx which actually needs them
        if (filePath.includes('layout.tsx')) return;

        // Remove <Navigation /> and <Navigation>...</Navigation>
        if (content.includes('<Navigation') || content.includes('<Navbar') || content.includes('<Footer')) {
            content = content.replace(/<Navigation\s*\/?>(?:.*?<\/Navigation>)?/gs, '');
            content = content.replace(/<Navbar\s*\/?>(?:.*?<\/Navbar>)?/gs, '');
            content = content.replace(/<Footer\s*\/?>(?:.*?<\/Footer>)?/gs, '');
            modified = true;
        }

        // Remove the unused imports to prevent Next.js build errors
        if (content.includes('import { Navigation }') || content.includes('import { Navbar }') || content.includes('import { Footer }')) {
            content = content.replace(/^import\s+.*?\bNavigation\b.*?$.*?\n/gm, '');
            content = content.replace(/^import\s+.*?\bNavbar\b.*?$.*?\n/gm, '');
            content = content.replace(/^import\s+.*?\bFooter\b.*?$.*?\n/gm, '');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Cleaned duplicates and imports from ${filePath}`);
        }
    }
});
console.log('Cleanup complete.');
