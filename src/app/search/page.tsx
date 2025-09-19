import { SearchPageContent } from "@/components/search/SearchPageContent";
import { SearchPageLoading } from "@/components/search/SearchPageLoading";
import { Suspense } from "react";

// Main export with Suspense wrapper
export default function SearchPage() {
    return (
        <Suspense fallback={<SearchPageLoading />}>
            <SearchPageContent />
        </Suspense>
    );
}