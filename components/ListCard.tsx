import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import TileRow from "./TileRow";

type Option = {
  _id: string;
  name: string;
  description: string;
  image_url: string;
  customFields: [];
  owner: string;
};

type List = {
  id: string;
  title: string;
  description: string;
  options: Option[];
};

type Props = {
  id: string;
  title: string;
  description: string;
  options: Option[];
  onPress: (id: string) => void;
};

const ListCard = ({ title, description, options = [], id, onPress }: Props) => {
  const { colours } = useTheme();

  return (
    <TouchableOpacity
      accessibilityLabel={`View details for ${title}`}
      accessibilityRole="button"
      onPress={() => onPress(id)}
    >
      <View style={[styles.card, { backgroundColor: colours.surface.primary }]}>
        <Text style={[styles.text, { color: colours.text.disabled }]}>
          #{id}
        </Text>

        <Text
          style={[styles.title, styles.text, { color: colours.text.primary }]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.description,
            styles.text,
            { color: colours.text.primary },
          ]}
        >
          {description}
        </Text>

        {options.length > 0 ? (
          <TileRow options={options} />
        ) : (
          <Text style={[styles.options, { color: colours.text.primary }]}>
            No options ...yet!
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 24,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 16,
  },
  text: {
    margin: 2,
  },
  description: {
    fontSize: 12,
  },
  options: {
    margin: 2,
    flexDirection: "row",
  },
});

export default ListCard;
