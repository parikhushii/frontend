import { defineStore } from "pinia";
//import { computed, ref } from "vue";

import { fetchy } from "@/utils/fetchy";

export const useCircleStore = defineStore(
  "circles",
  () => {
    const addToCircle = async (name: string, friend: string) => {
      await fetchy("/api/circles", "POST", {
        body: { name, friend },
      });
    };

    const removeFromCircle = async (friend: string) => {
      await fetchy("/api/circles", "PATCH", {
        body: { friend },
      });
    };

    return {
      addToCircle,
      removeFromCircle,
    };
  },
  { persist: true },
);
