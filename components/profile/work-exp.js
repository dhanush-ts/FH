import { Building, Clock, Award, Calendar } from 'lucide-react'
import serverSideFetch from '@/app/service';


const formatDate = (dateString) => {
  if (!dateString) return "Present";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

export default async function WorkExp() {
  const entries = await serverSideFetch("/user/work-experience/")
  
  const sortedEntries = [...entries].sort((a, b) => b.start_year - a.start_year);

  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-green-300 dark:border-green-700 p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <Building  className="h-16 w-16 text-green-500/60 mb-4" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No education history</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Educational background information will appear here once added.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="hidden md:block">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-300/10 via-green-500/50 to-green-300/10 transform -translate-x-1/2" />

          <div className="space-y-16 md:space-y-24">
            {sortedEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`relative group timeline-item ${index % 2 === 0 ? "md:pr-[5%]" : "md:pl-[5%] md:flex md:justify-end"}`}
              >
                <div
                  className="absolute left-1/2 w-10 h-10 bg-green-600 rounded-full items-center justify-center transform -translate-x-1/2 z-10 hidden md:flex shadow-md"
                >
                  <Building  className="w-5 h-5 text-white" />
                </div>

                <div
                  className={`hidden md:block absolute top-0 ${index % 2 === 0 ? "right-1/3" : "left-1/3"}`}
                >
                  <div
                    className={`font-bold text-lg px-3 py-1 rounded-full ${index % 2 === 0 ? "bg-green-100 text-green-700" : "bg-green-600 text-white"} flex items-center gap-1 shadow-sm`}
                  >
                    <Calendar className="w-4 h-4" />
                    {entry.start_year}
                  </div>
                </div>

                <div
                  className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 border border-green-200 dark:border-green-700 shadow-md md:max-w-[45%] md:w-[45%] ${index % 2 === 0 ? "ml-0" : "mr-0"}`}
                  style={{
                    background:
                      index % 2 === 0
                        ? "linear-gradient(to right, rgba(34, 197, 94, 0.03), rgba(34, 197, 94, 0.08))"
                        : "linear-gradient(to left, rgba(34, 197, 94, 0.03), rgba(34, 197, 94, 0.08))",
                  }}
                >
                  <div className="p-6 relative bg-white">
                    <div className="md:hidden mb-3">
                      <div className="font-bold text-sm px-2 py-1 rounded-full bg-white text-green-700 flex items-center gap-1 w-auto">
                        <Calendar className="w-3 h-3" />
                        {entry.start_year} - {entry.end_year || "Present"}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {entry.role}
                      </h3>

                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                        <Building className="h-5 w-5 mr-2 text-green-600" />
                        <span className="font-medium">{entry.organization}</span>
                      </div>

                      <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-500 mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {entry.start_year} - {entry.end_year || "Present"}
                        </span>
                      </div>

                      {entry.grade && (
                        <div className="flex items-center text-sm mb-2">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700">
                            <Award className="h-4 w-4" />
                            <span className="font-medium">{entry.grade} GPA</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative pl-8 md:hidden">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-300/10 via-green-500/50 to-green-300/10" />

          <div className="space-y-12">
            {sortedEntries.map((entry, index) => (
              <div key={entry.id} className="relative group">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center transform -translate-x-1/2 z-10 shadow-md">
                  <Building  className="w-4 h-4 text-white" />
                </div>

                <div className="absolute -left-4 top-10 transform -translate-x-1/2">
                  <div className="font-bold text-sm px-2 py-1 rounded-md bg-green-600 text-white flex items-center gap-1 shadow-md">
                    {entry.start_year}
                  </div>
                </div>

                <div
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 border border-green-200 dark:border-green-700 shadow-md ml-4"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(34, 197, 94, 0.03) 0%, 
                      rgba(34, 197, 94, 0.08) 50%, 
                      rgba(34, 197, 94, 0.03) 100%)`,
                  }}
                >
                  <div className="p-5 relative">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 pr-16">
                        {entry.role}
                      </h3>

                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <Building className="h-4 w-4 mr-2 text-green-600" />
                        <span className="font-medium">{entry.organization}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-500 mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {entry.start_year} - {entry.end_year || "Present"}
                        </span>
                      </div>

                      {entry.grade && (
                        <div className="flex items-center text-sm">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700">
                            <Award className="h-3.5 w-3.5" />
                            <span className="font-medium">{entry.grade} GPA</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
