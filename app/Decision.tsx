import ThisOrThat from "@/components/decision-processes/ThisOrThat";
import apiClient from "@/utils/api-client";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function Decision() {
  const processIds = {
    ["6784d7a5844f23ac9810cf50"]: "ThisOrThat",
  };
  const { decision_id } = useLocalSearchParams();
  const [decisionData, setDecisionData] = useState();

  useEffect(() => {
    apiClient
      .get(`/decisions/${decision_id}`)
      .then(({ data }) => {
        setDecisionData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [decision_id]);

  return <ThisOrThat></ThisOrThat>;
}
