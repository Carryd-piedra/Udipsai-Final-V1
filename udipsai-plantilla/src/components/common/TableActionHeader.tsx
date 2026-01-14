import { FileText, ListPlus, Search } from "lucide-react";
import React, { useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { FilterDropdown } from "./FilterDropdown";

interface TableActionHeaderProps {
  title: string;
  onSearchClick?: (term: string) => void;
  onNew?: () => void;
  newButtonText?: string;
  onExport?: () => void;
  loading?: boolean;
  placeholder?: string;
  onFilterApply?: () => void;
  onFilterClear?: () => void;
  filterContent?: React.ReactNode;
}

export const TableActionHeader: React.FC<TableActionHeaderProps> = ({
  title,
  onSearchClick,
  onNew,
  newButtonText = "Nuevo",
  onExport,
  loading = false,
  placeholder = "Buscar...",
  onFilterApply,
  onFilterClear,
  filterContent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (onSearchClick) {
      onSearchClick(searchTerm);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 ml-4">
        {title}
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {onSearchClick && (
            <div className="relative flex items-center group">
              <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="h-11 w-full sm:w-64 rounded-r-none border-r-0 focus:ring-0"
              />
              <Button
                onClick={handleSearchSubmit}
                className="h-11 rounded-l-none px-4 flex items-center gap-2 transition-all duration-200"
              >
                <Search size={16} />
              </Button>
            </div>
          )}

          {filterContent && onFilterApply && onFilterClear && (
            <FilterDropdown onApply={onFilterApply} onClear={onFilterClear}>
              {filterContent}
            </FilterDropdown>
          )}
        </div>

        <div className="flex gap-2">
          {onExport && (
            <Button
              variant="outline"
              onClick={onExport}
              disabled={loading}
              className="h-11"
            >
              <FileText size={16} /> <span className="hidden sm:inline">Exportar</span>
            </Button>
          )}

          {onNew && (
            <Button onClick={onNew} disabled={loading} className="h-11">
              <ListPlus size={16} /> {newButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
