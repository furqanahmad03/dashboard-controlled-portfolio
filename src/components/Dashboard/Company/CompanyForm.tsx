import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Company } from "@/interfaces/Company";
import Image from "next/image";

interface CompanyFormProps {
  company?: Company | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<Company>>({
    name: company?.name || "",
    website: company?.website || "",
    location: company?.location || "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name || "");
    if (formData.website) {
      formDataToSend.append("website", formData.website);
    }
    if (formData.location) {
      formDataToSend.append("location", formData.location);
    }

    if (logoFile) {
      formDataToSend.append("logo", logoFile);
    }

    await onSubmit(formDataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="text-base font-semibold dark:text-white text-gray-900"
        >
          Company Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="website"
          className="text-base font-semibold dark:text-white text-gray-900"
        >
          Website
        </Label>
        <Input
          id="website"
          type="url"
          value={formData.website || ""}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
          placeholder="https://example.com"
          className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="location"
          className="text-base font-semibold dark:text-white text-gray-900"
        >
          Location
        </Label>
        <Input
          id="location"
          value={formData.location || ""}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="City, Country"
          className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold dark:text-white text-gray-900">
          Company Logo
        </Label>

        {/* Show existing logo if available */}
        {company?.logo && !logoFile && (
          <div className="mb-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-background">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Logo:
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 border rounded-md overflow-hidden bg-white dark:bg-gray-700 flex items-center justify-center">
                <Image
                  src={company.logo}
                  alt="Current company logo"
                  className="w-full h-full object-cover"
                  width={16}
                  height={16}
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a new image to replace this logo
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setLogoFile(file);
            }}
            className="flex-1 py-2 h-fit dark:bg-background bg-white border-gray-600 dark:text-white text-gray-900 file:bg-purple-600 file:border-0 file:text-white file:px-4 file:rounded file:mr-4"
          />
          {logoFile && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLogoFile(null)}
              className="h-12 px-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
        {logoFile && (
          <div className="mt-3 p-4 border-2 border-dashed border-purple-500 rounded-lg bg-gray-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 border-2 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center shadow-sm">
                <Image
                  src={URL.createObjectURL(logoFile)}
                  alt="Logo preview"
                  className="w-full h-full object-cover"
                  width={16}
                  height={16}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white text-gray-900">
                  {logoFile.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-12 px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white border-0"
        >
          {isSubmitting 
            ? (mode === 'create' ? "Creating..." : "Updating...") 
            : (mode === 'create' ? "Create Company" : "Update Company")
          }
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CompanyForm;
