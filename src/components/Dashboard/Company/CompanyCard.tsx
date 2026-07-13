import { Card } from "@/components/ui/card";
import { Building2, Globe, MapPin, Edit, Trash2 } from "lucide-react";
import { Company } from "@/interfaces/Company";
import Image from "next/image";

const CompanyCard = ({
  company,
  openEditDialog,
  openDeleteDialog,
}: {
  company: Company;
  openEditDialog: (company: Company) => void;
  openDeleteDialog: (company: Company) => void;
}) => {
  return (
    <>
      <Card
        key={company.id}
        className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-[#0A0B0B] border border-gray-200 dark:border-gray-800 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-purple-500/30"
      >
        {/* Elegant Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 via-transparent to-blue-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Subtle Geometric Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] group-hover:opacity-[0.025] transition-opacity duration-700"
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px), linear-gradient(-45deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Header with Logo and Actions */}
        <div className="relative p-5 pb-4">
          <div className="flex items-start justify-between mb-4">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              {company.logo ? (
                <div className="w-14 h-14 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:shadow-purple-500/25 group-hover:border-purple-500/30 transition-all duration-500 group-hover:scale-110">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-9 h-9 object-contain"
                    width={16}
                    height={16}
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30 shadow-2xl group-hover:shadow-purple-500/25 group-hover:border-purple-500/50 transition-all duration-500 group-hover:scale-110">
                  <Building2 className="h-7 w-7 text-purple-300" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={() => openEditDialog(company)}
                className="inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 p-0 bg-gray-800/80 hover:bg-gray-700/80 shadow-lg border border-gray-700/50 text-gray-300 hover:text-white hover:scale-110 hover:shadow-purple-500/20"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => openDeleteDialog(company)}
                className="inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 p-0 bg-red-600/80 hover:bg-red-500/80 shadow-lg border border-red-500/50 text-red-100 hover:text-white hover:scale-110 hover:shadow-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Company Name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors duration-500 leading-tight">
            {company.name}
          </h3>
        </div>

        {/* Content Section */}
        <div className="px-5 pb-5 space-y-4">
          {/* Website Link */}
          {company.website && (
            <div className="flex items-center space-x-3 group/website">
              <div className="w-7 h-7 bg-blue-500/15 rounded-xl flex items-center justify-center border border-blue-500/25 group-hover/website:bg-blue-500/25 group-hover/website:border-blue-500/40 transition-all duration-300">
                <Globe className="h-4 w-4 text-blue-400" />
              </div>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm dark:text-blue-300 text-blue-900 hover:text-blue-200 hover:underline transition-all duration-300 flex-1 truncate font-medium"
              >
                Visit Website
              </a>
            </div>
          )}

          {/* Location */}
          {company.location && (
            <div className="flex items-center space-x-3 group/location">
              <div className="w-7 h-7 bg-purple-500/15 rounded-xl flex items-center justify-center border border-purple-500/25 group-hover/location:bg-purple-500/25 group-hover/location:border-purple-500/40 transition-all duration-300">
                <MapPin className="h-4 w-4 text-purple-500" />
              </div>
              <span className="text-sm dark:text-gray-300 text-gray-900 group-hover/location:text-purple-200 transition-colors duration-300 flex-1 truncate font-medium">
                {company.location}
              </span>
            </div>
          )}

          {/* Footer with Timestamps */}
          <div className="pt-4 border-t border-gray-800/50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-sm"></div>
                <span className="font-medium">
                  Added{" "}
                  {new Date(company.createdAt || "").toLocaleDateString(
                    "en-US",
                    { month: "short", year: "2-digit" }
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full shadow-sm"></div>
                <span className="font-medium">
                  Updated{" "}
                  {new Date(company.updatedAt || "").toLocaleDateString(
                    "en-US",
                    { month: "short", year: "2-digit" }
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Hover Border Effect */}
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-purple-500/30 transition-all duration-500 pointer-events-none" />
      </Card>
    </>
  );
};

export default CompanyCard;
