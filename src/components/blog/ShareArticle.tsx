
import { Facebook, Linkedin, Share2, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ShareArticleProps {
  title: string;
  url: string;
}

export function ShareArticle({ title, url }: ShareArticleProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "hover:bg-[#4267B2] text-[#4267B2] hover:text-white"
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      className: "hover:bg-[#1DA1F2] text-[#1DA1F2] hover:text-white"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      className: "hover:bg-[#0077B5] text-[#0077B5] hover:text-white"
    }
  ];

  return (
    <div className="mt-12 mb-8">
      <Separator className="my-8" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          <h3 className="text-xl font-semibold">Share This Article, Choose Your Platform!</h3>
        </div>
        <div className="flex gap-4">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full border transition-colors ${link.className}`}
              aria-label={`Share on ${link.name}`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
