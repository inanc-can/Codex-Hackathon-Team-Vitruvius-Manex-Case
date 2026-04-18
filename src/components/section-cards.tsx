"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { formatInt } from "@/lib/utils"

export function SectionCards({
  totalProducts,
  totalClaims,
  priorityIssues,
  stakeholderLenses,
}: {
  totalProducts: number
  totalClaims: number
  priorityIssues: number
  stakeholderLenses: number
}) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card rounded-[12px] border-[#d7deea] bg-white shadow-none">
        <CardHeader className="gap-2">
          <CardDescription className="font-medium text-[#5b6474]">Priority issues</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatInt(priorityIssues)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="rounded-[8px] border-[#f3d7aa] bg-[#fff7eb] px-2.5 py-1 text-[#8a4b00]">
              <TrendingUpIcon
              />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 border-t border-[#eef2f7] pt-4 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-[#0f172a]">
            Critical and high-severity lanes{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-[#5b6474]">
            Requires cross-functional coordination
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card rounded-[12px] border-[#d7deea] bg-white shadow-none">
        <CardHeader className="gap-2">
          <CardDescription className="font-medium text-[#5b6474]">Affected products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatInt(totalProducts)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="rounded-[8px] border-[#c9d8ff] bg-[#e8efff] px-2.5 py-1 text-[#0B5FFF]">
              <TrendingUpIcon
              />
              Tracked
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 border-t border-[#eef2f7] pt-4 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-[#0f172a]">
            Exposure across active investigations{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-[#5b6474]">
            Product population linked to current quality signals
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card rounded-[12px] border-[#d7deea] bg-white shadow-none">
        <CardHeader className="gap-2">
          <CardDescription className="font-medium text-[#5b6474]">Field claims</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatInt(totalClaims)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="rounded-[8px] border-[#f3d7aa] bg-[#fff7eb] px-2.5 py-1 text-[#8a4b00]">
              <TrendingDownIcon
              />
              Customer impact
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 border-t border-[#eef2f7] pt-4 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-[#0f172a]">
            Claim signals are grounded in the same workflow{" "}
            <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-[#5b6474]">Customer-visible events stay connected to evidence</div>
        </CardFooter>
      </Card>
      <Card className="@container/card rounded-[12px] border-[#d7deea] bg-white shadow-none">
        <CardHeader className="gap-2">
          <CardDescription className="font-medium text-[#5b6474]">Stakeholder lenses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatInt(stakeholderLenses)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="rounded-[8px] border-[#b9e4da] bg-[#edf8f5] px-2.5 py-1 text-[#005B4A]">
              <TrendingUpIcon
              />
              Aligned
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 border-t border-[#eef2f7] pt-4 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-[#0f172a]">
            Shared evidence across functions{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-[#5b6474]">Quality, supplier, operations, and leadership stay aligned</div>
        </CardFooter>
      </Card>
    </div>
  )
}
