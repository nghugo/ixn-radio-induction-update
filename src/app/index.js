import * as React from "react";
import { Text } from 'react-native'
import { Link } from "expo-router";

export default function Home() {
  return (
    <>
      <Text>This is the index page!!!!!</Text>
      <Link href="/another">
        Go to another page
      </Link>
    </>
  );
};

