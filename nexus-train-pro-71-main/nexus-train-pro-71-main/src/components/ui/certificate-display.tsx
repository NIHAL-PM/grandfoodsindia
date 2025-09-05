import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, FileText, Download, Share2 } from "lucide-react";

interface CertificateDisplayProps {
  certificate: {
    certificate_id?: string;
    student_name: string;
    course_title: string;
    issued_at: string;
    pdf_url?: string;
    is_valid: boolean;
  };
}

export const CertificateDisplay = ({ certificate }: CertificateDisplayProps) => {
  return (
    <Card className="card-elevated border-success/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-success">
          <CheckCircle className="w-6 h-6" />
          <span>Certificate Verified!</span>
        </CardTitle>
        <Badge className="bg-success/20 text-success w-fit">
          Valid
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-playfair font-bold">{certificate.course_title}</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Student Name</Label>
              <p className="font-medium">{certificate.student_name}</p>
            </div>
            
            <div>
              <Label className="text-muted-foreground">Issued Date</Label>
              <p className="font-medium">
                {new Date(certificate.issued_at).toLocaleDateString()}
              </p>
            </div>
            
            {certificate.certificate_id && (
              <div>
                <Label className="text-muted-foreground">Certificate ID</Label>
                <p className="font-mono text-sm bg-muted p-2 rounded">
                  {certificate.certificate_id}
                </p>
              </div>
            )}
          </div>

          {certificate.pdf_url && (
            <div className="flex space-x-2">
              <Button asChild className="btn-hero flex-1">
                <a 
                  href={certificate.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Certificate</span>
                </a>
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};