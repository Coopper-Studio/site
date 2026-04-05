"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { create } from "@orama/orama";

function initOrama() {
  return create({
    schema: { _: "string" },
  });
}

function EmptyState() {
  return (
    <div className="px-4 pb-4 text-sm text-muted-foreground">
      No results found. Try an article title, a tag, or a shorter keyword.
    </div>
  );
}

function IdleState() {
  return (
    <div className="px-4 pb-4 text-sm text-muted-foreground">
      Start with a title, tag, or keyword.
    </div>
  );
}

export default function CustomSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    type: "static",
    initOrama,
  });

  const items =
    query.data && query.data !== "empty" && Array.isArray(query.data)
      ? query.data
      : null;

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput placeholder="Search titles, tags, or keywords" />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={items} Empty={search.length > 0 ? EmptyState : IdleState} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
