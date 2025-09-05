import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, Video, Link, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { useNavigate, useParams } from 'react-router-dom';

const CourseMaterials = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [courseInfo] = useState({
    id: id || "prp-mentoring",
    title: "Professional Mentoring Program",
    instructor: "Dr. Sarah Johnson",
    description: "Comprehensive course materials for professional development and mentoring skills"
  });

  const [materials] = useState([
    {
      id: 1,
      title: "Course Introduction and Overview",
      type: "pdf",
      size: "2.5 MB",
      uploadDate: "2024-01-15",
      category: "lecture",
      description: "Introduction to the professional mentoring program and learning objectives"
    },
    {
      id: 2,
      title: "Mentoring Fundamentals - Week 1",
      type: "video",
      size: "156 MB",
      duration: "45 mins",
      uploadDate: "2024-01-22",
      category: "lecture",
      description: "Core principles of effective mentoring relationships"
    },
    {
      id: 3,
      title: "Communication Strategies Workbook",
      type: "pdf",
      size: "1.8 MB",
      uploadDate: "2024-01-29",
      category: "assignment",
      description: "Interactive workbook for developing communication skills"
    },
    {
      id: 4,
      title: "Live Session Recording - Goal Setting",
      type: "video",
      size: "203 MB",
      duration: "1hr 15mins",
      uploadDate: "2024-02-05",
      category: "recording",
      description: "Recorded live session on effective goal setting techniques"
    },
    {
      id: 5,
      title: "Case Study Templates",
      type: "doc",
      size: "567 KB",
      uploadDate: "2024-02-12",
      category: "template",
      description: "Templates for analyzing mentoring case studies"
    },
    {
      id: 6,
      title: "Additional Reading Resources",
      type: "link",
      uploadDate: "2024-02-19",
      category: "resource",
      description: "Curated list of external articles and research papers"
    },
    {
      id: 7,
      title: "Final Project Guidelines",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: "2024-02-26",
      category: "assignment",
      description: "Comprehensive guidelines for the final mentoring project"
    }
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'link':
        return <Link className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800';
      case 'assignment':
        return 'bg-orange-100 text-orange-800';
      case 'recording':
        return 'bg-purple-100 text-purple-800';
      case 'template':
        return 'bg-green-100 text-green-800';
      case 'resource':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadMaterial = (material: any) => {
    toast({ title: `Downloading ${material.title}...` });
    // In a real app, this would trigger the actual download
  };

  const openMaterial = (material: any) => {
    if (material.type === 'link') {
      toast({ title: "Opening external resource..." });
      // In a real app, this would open the external link
    } else {
      toast({ title: `Opening ${material.title}...` });
      // In a real app, this would open the file in a viewer
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || material.category === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{courseInfo.title}</h1>
            <p className="text-muted-foreground">
              Course Materials • Instructor: {courseInfo.instructor}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  <SelectItem value="lecture">Lectures</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                  <SelectItem value="recording">Recordings</SelectItem>
                  <SelectItem value="template">Templates</SelectItem>
                  <SelectItem value="resource">Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Materials List */}
        <div className="space-y-4">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(material.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-lg leading-tight">{material.title}</h3>
                      <Badge className={getCategoryColor(material.category)}>
                        {material.category}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-3">
                      {material.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {material.size && (
                        <span>Size: {material.size}</span>
                      )}
                      {material.duration && (
                        <span>Duration: {material.duration}</span>
                      )}
                      <span>Uploaded: {new Date(material.uploadDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => openMaterial(material)}
                        className="flex items-center gap-2"
                      >
                        {material.type === 'link' ? (
                          <>
                            <Link className="w-4 h-4" />
                            Open Link
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            View
                          </>
                        )}
                      </Button>
                      
                      {material.type !== 'link' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadMaterial(material)}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No materials found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filter settings.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseMaterials;
