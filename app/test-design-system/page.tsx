"use client";

import { useState } from "react";
import Pill from "@/app/components/design-system/Pill";
import FlagIcon from "@/app/components/design-system/FlagIcon";
import MultiSelectDropdown from "@/app/components/design-system/MultiSelectDropdown";

export default function TestDesignSystem() {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([
    "Italian",
    "Japanese",
  ]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    []
  );

  const cuisineOptions = [
    { value: "Italian", label: "Italian" },
    { value: "Mexican", label: "Mexican" },
    { value: "Japanese", label: "Japanese" },
    { value: "Chinese", label: "Chinese" },
    { value: "Indian", label: "Indian" },
    { value: "Mediterranean", label: "Mediterranean" },
  ];

  const restrictionOptions = [
    { value: "Vegetarian", label: "Vegetarian" },
    { value: "Vegan", label: "Vegan" },
    { value: "Gluten-free", label: "Gluten-free" },
    { value: "Dairy-free", label: "Dairy-free" },
  ];

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">Design System Test Page</h1>

      {/* Test Pill Component */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pill Component</h2>
        <div className="flex flex-wrap gap-2">
          <Pill
            text="Italian"
            icon={<FlagIcon cuisine="Italian" />}
            onRemove={() => console.log("Remove Italian")}
          />
          <Pill
            text="Mexican"
            icon={<FlagIcon cuisine="Mexican" />}
            onRemove={() => console.log("Remove Mexican")}
          />
          <Pill text="No Icon" onRemove={() => console.log("Remove No Icon")} />
          <Pill
            text="Very Long Text That Should Truncate With Ellipsis"
            onRemove={() => console.log("Remove long")}
          />
        </div>
      </section>

      {/* Test FlagIcon Component */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Flag Icons</h2>
        <div className="flex flex-wrap gap-4 text-2xl">
          {cuisineOptions.map((c) => (
            <div key={c.value} className="text-center">
              <FlagIcon cuisine={c.value} />
              <div className="text-xs mt-1">{c.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Test MultiSelectDropdown Component */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Multi-Select Dropdown</h2>
        <div className="max-w-md">
          <label className="label">
            <span className="label-text">Select Cuisines</span>
          </label>
          <MultiSelectDropdown
            options={cuisineOptions}
            selected={selectedCuisines}
            onChange={setSelectedCuisines}
            placeholder="Select cuisines"
          />
          <p className="mt-2 text-sm">
            Selected: {selectedCuisines.join(", ")}
          </p>
        </div>

        <div className="max-w-md">
          <label className="label">
            <span className="label-text">Dietary Restrictions (Optional)</span>
          </label>
          <MultiSelectDropdown
            options={restrictionOptions}
            selected={selectedRestrictions}
            onChange={setSelectedRestrictions}
            placeholder="Select restrictions (optional)"
          />
          <p className="mt-2 text-sm text-base-content opacity-70">
            Selected: {selectedRestrictions.join(", ") || "None - that's fine!"}
          </p>
        </div>

        <div className="max-w-md">
          <label className="label">
            <span className="label-text">Example: Error State</span>
          </label>
          <MultiSelectDropdown
            options={cuisineOptions}
            selected={[]}
            onChange={() => {}}
            placeholder="This shows error state"
            error="This field is required (demo only)"
          />
          <p className="mt-2 text-xs text-base-content opacity-70">
            ↑ This demonstrates the error state styling
          </p>
        </div>
      </section>
    </div>
  );
}
