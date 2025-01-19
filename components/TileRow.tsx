import React from "react";
import { StyleSheet, View, Image } from "react-native";

type Option = {
  id: string;
  image_url: string;
};

type Props = {
  options: Option[];
};

const TileRow: React.FC<Props> = ({ options }) => {
  return (
    <View style={styles.tileContainer}>
      {options.map((option) => (
        <>
          <Image
            key={option.id}
            source={{
              uri: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            }}
            style={styles.tileImage}
          />
        </>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
    width: "100%",
  },
  tileText: {
    marginTop: 20,
    margin: 10,
  },
  tileImage: {
    marginTop: 10,
    margin: 10,
    marginBottom: 0,
    width: 60,
    height: 60,
    borderRadius: 10,
  },
});

export default TileRow;
