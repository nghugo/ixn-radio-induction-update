import React, { useContext } from "react";

import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AutoScrollView from "../components/AutoScrollView";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import { contentContainerStyles } from "../styles/contentContainer";
import { useKeyboardHeight } from "../hooks/keyboard/keyboardHeight";

import lunr from "lunr";
import { TText } from "../app/_layout";
import { fontSize } from "src/styles/fontConfig";

function stripHtmlTags(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

// Function to add tagFreeContent field to each item in contentData
function addTagFreeContent(contentData) {
  return contentData.map((item) => ({
    ...item,
    tagFreeContent: stripHtmlTags(item.content),
  }));
}

const SearchAutocompleteContainer = ({
  contentData,
  searchbarText,
  setSearchbarInFocus,
}) => {
  // Prepare data for Lunr.js
  const documents = addTagFreeContent(contentData);

  // Create Lunr.js index
  const index = lunr(function () {
    this.field("description");
    this.field("tagFreeContent");
    this.field("secret");
    this.field("title");
    this.ref("id");

    documents.forEach((doc) => this.add(doc));
  });

  // Function to search and rank contentData
  function search(query) {
    const results = index.search(query);
    console.log("searchResults", results);
    return results.map((result) => {
      const item = documents.find((doc) => doc.id === result.ref);
      return { item, score: result.score };
    });
  }

  const query = searchbarText;
  const contentDataSearchRanked = search(query);

  console.log("query ->", query);
  console.log("contentDataSearchRanked ->", String(contentDataSearchRanked));

  const keyboardHeight = useKeyboardHeight();

  var fakeDocs = [
    {
      name: "Lunr",
      text: "Like Solr, but much smaller, and not as bright.",
    },
    {
      name: "React",
      text: "A JavaScript library for building user interfaces.",
    },
    {
      name: "Lodash",
      text: "A modern JavaScript utility library delivering modularity, performance & extras.",
    },
  ];
  // Create Lunr index
  const idx = lunr(function () {
    this.ref("name"); // Document unique identifier
    this.field("text"); // Index and search within the 'text' field

    fakeDocs.forEach((doc) => {
      this.add(doc);
    });
  });

  // Perform a search
  const results = idx.search("javascript");

  // Log the results
  console.log("Search results:", results);
  results.forEach((result) => {
    console.log(result.matchData.metadata)
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1, marginBottom: keyboardHeight }}>
      <ScrollView
        style={{ ...contentContainerStyles.container, flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flexDirection: "column",
            gap: 10, // gap must be placed in <View> not <ScrollView>
          }}
        >
          {/* {contentDataSearchRanked.length > 0 &&
            contentDataSearchRanked.map((c, index) => (
              <SearchAutocompleteElement
                key={index}
                id={c.item.id}
                content={c.item.content} // content necessary if using topics route
                title={c.item.title} // title necessary if using topics route
                secret={c.item.secret}
                contentData={contentData}
                section={c.item.title} // TODO: change to matching field
                routerLink={"topicsReadOnly/[id]"}
                setSearchbarInFocus={setSearchbarInFocus}
              />
            ))}
          {!searchbarText && contentDataSearchRanked.length === 0 && (
            <View style={{ alignItems: "center" }}>
              <TText
                style={{
                  fontSize: fontSize.SMALL,
                  fontFamily: "InterRegular",
                }}
              >
                Please enter a search query
              </TText>
            </View>
          )}
          {searchbarText && contentDataSearchRanked.length === 0 && (
            <View style={{ alignItems: "center" }}>
              <TText
                style={{
                  fontSize: fontSize.SMALL,
                  fontFamily: "InterRegular",
                }}
              >
                No results found
              </TText>
            </View>
          )} */}
        </View>
        <View style={{ minHeight: 20 }}>{/* spacer */}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchAutocompleteContainer;
