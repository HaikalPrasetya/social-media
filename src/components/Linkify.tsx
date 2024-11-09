import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkifyWithTooltip from "./UserLinkifyWithTooltip";

interface LinkifyProps {
  children: React.ReactNode;
}

export function Linkify({ children }: LinkifyProps) {
  return (
    <LinkUsername>
      <LinkHashtag>
        <Linkit>{children}</Linkit>
      </LinkHashtag>
    </LinkUsername>
  );
}

function Linkit({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

function LinkUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <UserLinkifyWithTooltip key={key} username={match.slice(1)}>
          {match}
        </UserLinkifyWithTooltip>
      )}
    >
      {children}
    </LinkIt>
  );
}

function LinkHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}
