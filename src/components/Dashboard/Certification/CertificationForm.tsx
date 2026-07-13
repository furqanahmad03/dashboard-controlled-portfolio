import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react";
import { Certification } from "@/interfaces/Certification";
import Image from "next/image";

interface CertificationSubmitData {
  title: string;
  issuer: string;
  issuerWebsite?: string;
  issueDate: string;
  credentialID?: string;
  credentialURL?: string;
  status: "Active" | "Inactive" | "Pending" | "Surrendered" | "Withdrawn" | "Suspended" | "Revoked" | "Expired";
  logoFile?: File;
  certificatePictureFile?: File;
}

interface CertificationFormProps {
  mode: "create" | "edit";
  certification?: Certification | null;
  onSubmit: (formData: CertificationSubmitData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const CertificationForm: React.FC<CertificationFormProps> = ({
  mode,
  certification,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    title: certification?.title || "",
    issuer: certification?.issuer || "",
    issuerWebsite: certification?.issuerWebsite || "",
    issueDate: certification?.issueDate ? new Date(certification.issueDate) : new Date(),
    credentialID: certification?.credentialID || "",
    credentialURL: certification?.credentialURL || "",
    status: certification?.status || "Active" as "Active" | "Inactive" | "Pending" | "Surrendered" | "Withdrawn" | "Suspended" | "Revoked" | "Expired",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [certificatePictureFile, setCertificatePictureFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend = {
      title: formData.title,
      issuer: formData.issuer,
      issuerWebsite: formData.issuerWebsite || undefined,
      issueDate: formData.issueDate?.toISOString() || "",
      credentialID: formData.credentialID || undefined,
      credentialURL: formData.credentialURL || undefined,
      status: formData.status,
      logoFile: logoFile || undefined,
      certificatePictureFile: certificatePictureFile || undefined,
    };

    await onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-base font-semibold text-foreground"
          >
            Certification Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
            placeholder="e.g., AWS Solutions Architect"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="issuer"
            className="text-base font-semibold text-foreground"
          >
            Issuer *
          </Label>
          <Input
            id="issuer"
            value={formData.issuer}
            onChange={(e) =>
              setFormData({ ...formData, issuer: e.target.value })
            }
            required
            className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
            placeholder="e.g., Amazon Web Services"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="issueDate"
            className="text-base font-semibold text-foreground"
          >
            Issue Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-12 w-full justify-between font-normal text-sm bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
              >
                <span className="truncate">
                  {formData.issueDate
                    ? formData.issueDate.toLocaleDateString()
                    : "Select issue date"}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
              align="start"
            >
              <Calendar
                mode="single"
                selected={formData.issueDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setFormData({
                    ...formData,
                    issueDate: date || new Date(),
                  });
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="status"
            className="text-base font-semibold text-foreground"
          >
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: Certification['status']) =>
              setFormData({
                ...formData,
                status: value,
              })
            }
          >
            <SelectTrigger className="!h-12 w-full bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Revoked">Revoked</SelectItem>
              <SelectItem value="Surrendered">Surrendered</SelectItem>
              <SelectItem value="Withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="issuerWebsite"
          className="text-base font-semibold text-foreground"
        >
          Issuer Website
        </Label>
        <Input
          id="issuerWebsite"
          type="url"
          value={formData.issuerWebsite || ""}
          onChange={(e) =>
            setFormData({ ...formData, issuerWebsite: e.target.value })
          }
          className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="credentialID"
          className="text-base font-semibold text-foreground"
        >
          Credential ID
        </Label>
        <Input
          id="credentialID"
          value={formData.credentialID || ""}
          onChange={(e) =>
            setFormData({ ...formData, credentialID: e.target.value })
          }
          className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
          placeholder="e.g., AWS-SA-2024-001"
        />
      </div>

      <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-sm space-y-2">
        <p className="text-sm italic text-muted-foreground">
          Either you can enter Credential URL or upload your local Certificate
          Picture
        </p>

        <div className="space-y-2">
          <Label
            htmlFor="credentialURL"
            className="text-base font-semibold text-foreground"
          >
            Credential URL
          </Label>

          {/* Warning message if certificate file is selected */}
          {certificatePictureFile && (
            <div className="mb-3 p-3 border border-orange-200 dark:border-orange-700 rounded-lg bg-orange-50 dark:bg-orange-950/30">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                ⚠️ Warning
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                You have selected a certificate file. If you enter a
                credential URL, your certificate file will be removed.
              </p>
            </div>
          )}

          <Input
            id="credentialURL"
            type="url"
            value={formData.credentialURL || ""}
            onChange={(e) => {
              setFormData({ ...formData, credentialURL: e.target.value });
              if (e.target.value) {
                setCertificatePictureFile(null);
              }
            }}
            disabled={!!certificatePictureFile}
            className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="https://verify.example.com"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold text-foreground">
            Certificate
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setCertificatePictureFile(file);
                if (file) {
                  setFormData({ ...formData, credentialURL: "" });
                }
              }}
              disabled={!!formData.credentialURL}
              className="flex-1 py-2 h-fit bg-background border-border text-foreground file:bg-purple-600 file:border-0 file:text-white file:px-4 file:rounded file:mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {certificatePictureFile && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCertificatePictureFile(null)}
                className="h-12 px-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Remove
              </Button>
            )}
          </div>
          {/* Show existing certificate in edit mode */}
          {mode === "edit" && certification?.certificate && !certificatePictureFile && (
            <div className="mt-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20 border-2 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                  <Image
                    src={certification.certificate}
                    alt="Current certificate"
                    className="w-full h-full object-cover"
                    width={16}
                    height={16}
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Current Certificate
                  </p>
                  <p className="text-xs text-gray-400">
                    Upload a new file to replace
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Show new certificate preview */}
          {certificatePictureFile && (
            <div className="mt-3 p-4 border-2 border-dashed border-purple-500 rounded-lg bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20 border-2 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center shadow-sm">
                  <Image
                    src={URL.createObjectURL(certificatePictureFile)}
                    alt="Certificate preview"
                    className="w-full h-full object-cover"
                    width={16}
                    height={16}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {certificatePictureFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(certificatePictureFile.size / 1024 / 1024).toFixed(2)}{" "}
                    MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold text-foreground">
          Logo
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setLogoFile(file);
            }}
            className="flex-1 py-2 h-fit bg-background border-border text-foreground file:bg-purple-600 file:border-0 file:text-white file:px-4 file:rounded file:mr-4"
          />
          {logoFile && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLogoFile(null)}
              className="h-12 px-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Remove
            </Button>
          )}
        </div>
        {/* Show existing logo in edit mode */}
        {mode === "edit" && certification?.logo && !logoFile && (
          <div className="mt-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 border-2 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                <Image
                  src={certification.logo}
                  alt="Current logo"
                  className="w-full h-full object-cover"
                  width={16}
                  height={16}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Current Logo
                </p>
                <p className="text-xs text-gray-400">
                  Upload a new file to replace
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Show new logo preview */}
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
                <p className="text-sm font-medium text-foreground">
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
            ? (mode === "create" ? "Creating..." : "Updating...") 
            : (mode === "create" ? "Create Certification" : "Update Certification")
          }
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CertificationForm;
