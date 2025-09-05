import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCertificate } from '@/hooks/useSupabase'
import { useAuth } from '@/context/AuthContext'
import { Award, Download, Share2 } from 'lucide-react'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

interface CertificateGeneratorProps {
  courseId?: string
  courseName?: string
  studentId?: string
  studentName?: string
}

export default function CertificateGenerator({ 
  courseId, 
  courseName, 
  studentId, 
  studentName 
}: CertificateGeneratorProps) {
  const { user } = useAuth()
  const createCertificate = useCreateCertificate()
  
  const [certificateData, setCertificateData] = useState({
    studentName: studentName || '',
    courseName: courseName || '',
    completionDate: new Date().toISOString().split('T')[0],
    grade: '',
    additionalText: ''
  })

  const generateUniqueCode = () => {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `KA-${timestamp}-${randomStr}`.toUpperCase()
  }

  const generateCertificatePDF = async (certificateCode: string) => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    // Certificate background
    pdf.setFillColor(255, 255, 255)
    pdf.rect(0, 0, 297, 210, 'F')
    
    // Border
    pdf.setLineWidth(3)
    pdf.setDrawColor(0, 123, 255)
    pdf.rect(10, 10, 277, 190)
    
    // Inner border
    pdf.setLineWidth(1)
    pdf.setDrawColor(108, 117, 125)
    pdf.rect(15, 15, 267, 180)

    // Header
    pdf.setFontSize(28)
    pdf.setTextColor(0, 123, 255)
    pdf.text('CERTIFICATE OF COMPLETION', 148.5, 40, { align: 'center' })
    
    // Decorative line
    pdf.setLineWidth(1)
    pdf.setDrawColor(0, 123, 255)
    pdf.line(50, 50, 247, 50)

    // Student name
    pdf.setFontSize(20)
    pdf.setTextColor(0, 0, 0)
    pdf.text('This is to certify that', 148.5, 70, { align: 'center' })
    
    pdf.setFontSize(32)
    pdf.setTextColor(0, 123, 255)
    pdf.text(certificateData.studentName, 148.5, 90, { align: 'center' })
    
    // Course completion text
    pdf.setFontSize(16)
    pdf.setTextColor(0, 0, 0)
    pdf.text('has successfully completed the course', 148.5, 110, { align: 'center' })
    
    pdf.setFontSize(24)
    pdf.setTextColor(40, 167, 69)
    pdf.text(certificateData.courseName, 148.5, 130, { align: 'center' })
    
    // Additional details
    if (certificateData.grade) {
      pdf.setFontSize(14)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Grade: ${certificateData.grade}`, 148.5, 145, { align: 'center' })
    }
    
    pdf.setFontSize(12)
    pdf.text(`Date of Completion: ${new Date(certificateData.completionDate).toLocaleDateString()}`, 148.5, 155, { align: 'center' })
    
    if (certificateData.additionalText) {
      pdf.setFontSize(10)
      pdf.text(certificateData.additionalText, 148.5, 165, { align: 'center' })
    }

    // Certificate ID and QR Code
    pdf.setFontSize(10)
    pdf.setTextColor(108, 117, 125)
    pdf.text(`Certificate ID: ${certificateCode}`, 20, 185)
    
    // Generate QR code
    try {
      const qrCodeUrl = await QRCode.toDataURL(`https://kaisanassociates.com/verify-certificate?code=${certificateCode}`)
      pdf.addImage(qrCodeUrl, 'PNG', 250, 160, 30, 30)
      pdf.text('Scan to verify', 265, 195, { align: 'center' })
    } catch (error) {
      console.error('Error generating QR code:', error)
    }

    // Organization details
    pdf.setFontSize(12)
    pdf.setTextColor(0, 123, 255)
    pdf.text('Kaisan Associates', 148.5, 175, { align: 'center' })
    
    return pdf
  }

  const handleGenerate = async () => {
    if (!certificateData.studentName || !certificateData.courseName) {
      return
    }

    try {
      const certificateCode = generateUniqueCode()
      const pdf = await generateCertificatePDF(certificateCode)
      
      // Convert PDF to blob for upload
      const pdfBlob = pdf.output('blob')
      
      // Create certificate record in database
      await createCertificate.mutateAsync({
        user_id: studentId || user?.id || '',
        course_id: courseId,
        code: certificateCode,
        qr_url: `https://kaisanassociates.com/verify-certificate?code=${certificateCode}`,
        pdf_url: '' // Would be set after uploading to storage
      })

      // Download the PDF
      pdf.save(`certificate-${certificateData.studentName}-${certificateCode}.pdf`)
      
    } catch (error) {
      console.error('Error generating certificate:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Certificate Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentName">Student Name</Label>
            <Input
              id="studentName"
              value={certificateData.studentName}
              onChange={(e) => setCertificateData(prev => ({ ...prev, studentName: e.target.value }))}
              placeholder="Enter student name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="courseName">Course Name</Label>
            <Input
              id="courseName"
              value={certificateData.courseName}
              onChange={(e) => setCertificateData(prev => ({ ...prev, courseName: e.target.value }))}
              placeholder="Enter course name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="completionDate">Completion Date</Label>
            <Input
              id="completionDate"
              type="date"
              value={certificateData.completionDate}
              onChange={(e) => setCertificateData(prev => ({ ...prev, completionDate: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grade">Grade (Optional)</Label>
            <Input
              id="grade"
              value={certificateData.grade}
              onChange={(e) => setCertificateData(prev => ({ ...prev, grade: e.target.value }))}
              placeholder="e.g., A+, 95%, Excellent"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="additionalText">Additional Text (Optional)</Label>
          <Textarea
            id="additionalText"
            value={certificateData.additionalText}
            onChange={(e) => setCertificateData(prev => ({ ...prev, additionalText: e.target.value }))}
            placeholder="Additional text to include on certificate"
            rows={3}
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleGenerate}
            disabled={!certificateData.studentName || !certificateData.courseName || createCertificate.isPending}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {createCertificate.isPending ? 'Generating...' : 'Generate Certificate'}
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}