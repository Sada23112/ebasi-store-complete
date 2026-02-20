"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Ruler, Users, AlertCircle, CheckCircle } from "lucide-react"

export default function SizeGuidePage() {
  const sizeCharts = {
    saree: {
      blouse: [
        { size: "XS", bust: "32", waist: "26", hip: "34" },
        { size: "S", bust: "34", waist: "28", hip: "36" },
        { size: "M", bust: "36", waist: "30", hip: "38" },
        { size: "L", bust: "38", waist: "32", hip: "40" },
        { size: "XL", bust: "40", waist: "34", hip: "42" },
        { size: "XXL", bust: "42", waist: "36", hip: "44" },
      ],
      petticoat: [
        { size: "XS", waist: "26", hip: "34", length: "38" },
        { size: "S", waist: "28", hip: "36", length: "38" },
        { size: "M", waist: "30", hip: "38", length: "38" },
        { size: "L", waist: "32", hip: "40", length: "38" },
        { size: "XL", waist: "34", hip: "42", length: "38" },
        { size: "XXL", waist: "36", hip: "44", length: "38" },
      ],
    },
    kurti: [
      { size: "XS", bust: "32", waist: "26", hip: "34", length: "42" },
      { size: "S", bust: "34", waist: "28", hip: "36", length: "42" },
      { size: "M", bust: "36", waist: "30", hip: "38", length: "44" },
      { size: "L", bust: "38", waist: "32", hip: "40", length: "44" },
      { size: "XL", bust: "40", waist: "34", hip: "42", length: "46" },
      { size: "XXL", bust: "42", waist: "36", hip: "44", length: "46" },
    ],
    lehenga: [
      { size: "XS", bust: "32", waist: "26", hip: "34", length: "42" },
      { size: "S", bust: "34", waist: "28", hip: "36", length: "42" },
      { size: "M", bust: "36", waist: "30", hip: "38", length: "44" },
      { size: "L", bust: "38", waist: "32", hip: "40", length: "44" },
      { size: "XL", bust: "40", waist: "34", hip: "42", length: "46" },
      { size: "XXL", bust: "42", waist: "36", hip: "44", length: "46" },
    ],
  }

  const measurementTips = [
    {
      title: "Bust Measurement",
      description: "Measure around the fullest part of your bust, keeping the tape parallel to the floor.",
      icon: <Ruler className="h-5 w-5" />,
    },
    {
      title: "Waist Measurement",
      description: "Measure around your natural waistline, which is the narrowest part of your torso.",
      icon: <Ruler className="h-5 w-5" />,
    },
    {
      title: "Hip Measurement",
      description: "Measure around the fullest part of your hips, about 7-9 inches below your waist.",
      icon: <Ruler className="h-5 w-5" />,
    },
    {
      title: "Length Measurement",
      description: "For tops, measure from shoulder to desired hem. For bottoms, measure from waist to ankle.",
      icon: <Ruler className="h-5 w-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      

      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">Size Guide</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive size guide. All measurements are in inches.
            </p>
          </div>

          {/* Measurement Tips */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                How to Measure Yourself
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {measurementTips.map((tip, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800">Measurement Tips</h4>
                    <ul className="text-sm text-amber-700 mt-1 space-y-1">
                      <li>• Use a soft measuring tape for accurate measurements</li>
                      <li>• Measure over your undergarments, not over clothes</li>
                      <li>• Keep the tape snug but not tight</li>
                      <li>• Ask someone to help you for better accuracy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Size Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Size Charts</CardTitle>
              <p className="text-muted-foreground">Select a category to view detailed size measurements</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="saree" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="saree">Saree & Blouse</TabsTrigger>
                  <TabsTrigger value="kurti">Kurti & Tops</TabsTrigger>
                  <TabsTrigger value="lehenga">Lehenga & Dresses</TabsTrigger>
                </TabsList>

                <TabsContent value="saree" className="space-y-6">
                  {/* Blouse Size Chart */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      Blouse Size Chart
                      <Badge variant="secondary">Most Popular</Badge>
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-border">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-border p-3 text-left">Size</th>
                            <th className="border border-border p-3 text-left">Bust (inches)</th>
                            <th className="border border-border p-3 text-left">Waist (inches)</th>
                            <th className="border border-border p-3 text-left">Hip (inches)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeCharts.saree.blouse.map((size, index) => (
                            <tr key={index} className="hover:bg-muted/50">
                              <td className="border border-border p-3 font-medium">{size.size}</td>
                              <td className="border border-border p-3">{size.bust}</td>
                              <td className="border border-border p-3">{size.waist}</td>
                              <td className="border border-border p-3">{size.hip}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Petticoat Size Chart */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Petticoat Size Chart</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-border">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-border p-3 text-left">Size</th>
                            <th className="border border-border p-3 text-left">Waist (inches)</th>
                            <th className="border border-border p-3 text-left">Hip (inches)</th>
                            <th className="border border-border p-3 text-left">Length (inches)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeCharts.saree.petticoat.map((size, index) => (
                            <tr key={index} className="hover:bg-muted/50">
                              <td className="border border-border p-3 font-medium">{size.size}</td>
                              <td className="border border-border p-3">{size.waist}</td>
                              <td className="border border-border p-3">{size.hip}</td>
                              <td className="border border-border p-3">{size.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="kurti">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Kurti & Tops Size Chart</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-border">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-border p-3 text-left">Size</th>
                            <th className="border border-border p-3 text-left">Bust (inches)</th>
                            <th className="border border-border p-3 text-left">Waist (inches)</th>
                            <th className="border border-border p-3 text-left">Hip (inches)</th>
                            <th className="border border-border p-3 text-left">Length (inches)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeCharts.kurti.map((size, index) => (
                            <tr key={index} className="hover:bg-muted/50">
                              <td className="border border-border p-3 font-medium">{size.size}</td>
                              <td className="border border-border p-3">{size.bust}</td>
                              <td className="border border-border p-3">{size.waist}</td>
                              <td className="border border-border p-3">{size.hip}</td>
                              <td className="border border-border p-3">{size.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lehenga">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Lehenga & Dresses Size Chart</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-border">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-border p-3 text-left">Size</th>
                            <th className="border border-border p-3 text-left">Bust (inches)</th>
                            <th className="border border-border p-3 text-left">Waist (inches)</th>
                            <th className="border border-border p-3 text-left">Hip (inches)</th>
                            <th className="border border-border p-3 text-left">Length (inches)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeCharts.lehenga.map((size, index) => (
                            <tr key={index} className="hover:bg-muted/50">
                              <td className="border border-border p-3 font-medium">{size.size}</td>
                              <td className="border border-border p-3">{size.bust}</td>
                              <td className="border border-border p-3">{size.waist}</td>
                              <td className="border border-border p-3">{size.hip}</td>
                              <td className="border border-border p-3">{size.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Fit Guide */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Perfect Fit Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">For Traditional Wear</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Saree blouses should fit snugly but allow comfortable movement</li>
                    <li>• Petticoats should sit at your natural waist</li>
                    <li>• Lehengas typically have 2-3 inches of ease for comfort</li>
                    <li>• Consider the drape and fall of the fabric</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">For Contemporary Wear</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Kurtis can be fitted or relaxed depending on style</li>
                    <li>• Palazzo pants should be loose-fitting at the hip</li>
                    <li>• Crop tops should end at your natural waist</li>
                    <li>• Consider layering when choosing sizes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact for Custom Sizing */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Need Custom Sizing?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find your size or need alterations? We offer custom sizing for most of our products.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="mailto:sizing@ebasistore.com"
                  className="inline-flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
                >
                  Email Sizing Team
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      
    </div>
  )
}
