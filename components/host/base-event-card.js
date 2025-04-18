import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"


export function UICard({ id, title, description, imageUrl, status, tags = [], link, footer }) {
  const CardWrapper = ({ children }) => {
    if (link) {
      return (
        <Link
          href={link}
          className="group block transition-all hover:shadow-md"
          >
          {children}
        </Link>
      );
    }
    return <>{children}</>
  }

  return (
    <CardWrapper>
      <Card className="h-full overflow-hidden border bg-card">
        <div className="relative">
          {/* Fixed-size square image container with consistent dimensions */}
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={imageUrl?.replace("localhost", "127.0.0.1") || "/placeholder.svg?height=300&width=300"}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>

          {/* Status badge positioned absolutely over the image */}
          {status && (
            <div className="absolute right-2 top-2">
              <Badge variant="secondary" className="font-medium">
                {status}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="line-clamp-1 text-lg font-bold tracking-tight">{title}</h3>
          <p className="line-clamp-2 mt-2 text-sm text-muted-foreground">{description}</p>

          {/* Tags display */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        {footer && <CardFooter className="p-4 pt-0">{footer}</CardFooter>}
      </Card>
    </CardWrapper>
  )
}
