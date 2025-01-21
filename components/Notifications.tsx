import { View, Text } from "react-native";
import { MenuOption } from "./DropdownMenu";
import { useRouter } from "expo-router";

type Props = {
  setIsNotificationDropdownVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function Notifications({
  setIsNotificationDropdownVisible,
}: Props) {
  const router = useRouter();
  return (
    <View>
      <MenuOption
        onSelect={() => {
          setIsNotificationDropdownVisible(false);
          router.push({
            pathname: "/Decision",
            params: { decision_id: "678940615a51bf4a2ed681c0" },
          });
        }}
      >
        <Text>You have a pending decision - click here to continue</Text>
      </MenuOption>
      <MenuOption onSelect={() => {}}>
        <Text>Decision completed: view decision history</Text>
      </MenuOption>
    </View>
  );
}
