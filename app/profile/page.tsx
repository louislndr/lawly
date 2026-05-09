"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import type { SavedCase } from "@/types/lawly";
import { getFakeUser, getPersistedCases } from "@/lib/user-data";
import { Calendar, FileText, CheckCircle, AlertCircle, Clock, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";

function urgencyColor(urgency: "low" | "medium" | "high"): string {
  if (urgency === "high") return "text-green-600 bg-green-50";
  if (urgency === "medium") return "text-amber-600 bg-amber-50";
  return "text-slate-600 bg-slate-50";
}

function statusIcon(status: "active" | "resolved" | "archived") {
  if (status === "resolved") return <CheckCircle className="h-5 w-5 text-green-600" />;
  if (status === "archived") return <Clock className="h-5 w-5 text-slate-400" />;
  return <AlertCircle className="h-5 w-5 text-blue-600" />;
}

function statusLabel(status: "active" | "resolved" | "archived"): string {
  if (status === "resolved") return "Resolved";
  if (status === "archived") return "Archived";
  return "Active";
}

export default function ProfilePage() {
  const router = useRouter();
  const user = getFakeUser();
  const [cases, setCases] = useState<ReturnType<typeof getPersistedCases>>(() => getPersistedCases());
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  useEffect(() => {
    setCases(getPersistedCases());

    const handleStorage = () => setCases(getPersistedCases());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  function openCase(caseItem: SavedCase) {
    sessionStorage.setItem(
      "lawly_case",
      JSON.stringify({ problem: caseItem.problem, analysis: caseItem.analysis, caseId: caseItem.id })
    );
    sessionStorage.setItem("lawly_case_id", caseItem.id);
    router.push("/case");
  }

  const activeCases = cases.filter((caseItem) => caseItem.status === "active");
  const resolvedCases = cases.filter((caseItem) => caseItem.status === "resolved");
  const displayCases =
    filter === "active" ? activeCases : filter === "resolved" ? resolvedCases : cases;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">
        {/* Profile Header */}
        <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              {/* Profile Info */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative h-24 w-24 shrink-0">
                  <Image
                    src={user.avatar || ""}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-[#172b5f]">{user.name}</h1>
                  <p className="mt-1 text-slate-600">{user.email}</p>
                  <p className="mt-3 text-sm text-slate-400">
                    Member since {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-[#172b5f]">{cases.length}</p>
                  <p className="mt-1 text-xs font-medium text-slate-600">Total Cases</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-green-50 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{activeCases.length}</p>
                  <p className="mt-1 text-xs font-medium text-slate-600">Active</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-blue-50 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{resolvedCases.length}</p>
                  <p className="mt-1 text-xs font-medium text-slate-600">Resolved</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cases Section */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[#172b5f]">Your Cases</h2>
                <p className="mt-2 text-sm text-slate-600">Manage and track your legal cases</p>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 border-b border-slate-200">
                {["all", "active", "resolved"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as typeof filter)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      filter === status
                        ? "border-b-2 border-[#172b5f] text-[#172b5f]"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {status === "all" ? "All Cases" : status === "active" ? "Active" : "Resolved"}
                  </button>
                ))}
              </div>
            </div>

            {/* Cases Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                >
                  {/* Status Badge */}
                  <div className="absolute right-4 top-4">
                    <div
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        caseItem.status === "resolved"
                          ? "bg-green-50 text-green-700"
                          : caseItem.status === "archived"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {statusIcon(caseItem.status)}
                      {statusLabel(caseItem.status)}
                    </div>
                  </div>

                  <div>
                    {/* Category */}
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                      {caseItem.category}
                    </p>

                    {/* Title */}
                    <h3 className="mt-3 text-base font-semibold text-[#172b5f] line-clamp-2">
                      {caseItem.problem}
                    </h3>

                    {/* Urgency Badge */}
                    {caseItem.analysis.supported && caseItem.analysis.nextSteps.length > 0 && (
                      <div className="mt-4 inline-block">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${urgencyColor(caseItem.analysis.nextSteps[0].urgency)}`}
                        >
                          {caseItem.analysis.nextSteps[0].urgency === "high" && (
                            <AlertCircle className="h-3.5 w-3.5" />
                          )}
                          {caseItem.analysis.nextSteps[0].urgency === "medium" && (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          {caseItem.analysis.nextSteps[0].urgency === "high"
                            ? "Urgent"
                            : caseItem.analysis.nextSteps[0].urgency === "medium"
                              ? "Soon"
                              : "Low Priority"}
                        </span>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Created{" "}
                        {new Date(caseItem.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5" />
                        Last updated{" "}
                        {new Date(caseItem.lastModified).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openCase(caseItem)}
                        className="flex-1 rounded-lg bg-[#172b5f] px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-[#203875]"
                      >
                        View Case
                      </button>
                      <button
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        aria-label="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayCases.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">No {filter !== "all" ? filter : ""} cases yet</p>
                <p className="mt-1 text-xs text-slate-600">
                  Start by analyzing your legal issue using the problem form on the home page.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block rounded-lg bg-[#172b5f] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#203875]"
                >
                  Create New Case
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
