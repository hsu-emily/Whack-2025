import React, { useState } from "react";
import GreenWindows from "../assets/punch_cards/WindowsGreen.png";
import PinkWindows from "../assets/punch_cards/WindowsPink.png";
import Layout from "../components/Layout";
import PunchCardPreview from "../components/PunchCardPreview";

// Load both PNG and SVG icons
const iconModulesPNG = import.meta.glob("../assets/icons/*.png", { eager: true });
const iconModulesSVG = import.meta.glob("../assets/icons/*.svg", { eager: true });
const iconMap = {};
for (const path in iconModulesPNG) {
  const filename = path.split("/").pop();
  iconMap[filename] = iconModulesPNG[path].default;
}
for (const path in iconModulesSVG) {
  const filename = path.split("/").pop();
  iconMap[filename] = iconModulesSVG[path].default;
}

// --- Re-introducing Background Layouts ---
const backgroundLayouts = {
  "WindowsGreen.png": {
    title: {
      top: "4%", // Adjust these percentages/pixels based on your WindowsGreen.png design
      left: "0%",
      textAlign: "center",
      color: "#0b693c", // Example text color for this background
      fontSize: "2rem", // Example font size
      fontWeight: "bold",
      font: "Press Start 2P",
      width: "70%", // Limit width to prevent overflow
    },
    description: {
      top: "23%", // Adjust for description placement
      left: "0%",
      textAlign: "center",
      color: "#0b693c", // Example text color
      fontSize: "1rem",
      font: "CityLight Dots",
      width: "70%",
    },
    punchGrid: {
      top: "45%", // Adjust vertical position of the entire grid
      punchCircleSize: "100px", // Larger punch circles
      punchIconSize: "100px", // Larger icons inside the punches
      punchHorizontalGap: "50px", // More space between punches horizontally
      punchVerticalGap: "70px", // More space between punch rows vertically
      numRows: 2, // You can make these dynamic too if backgrounds dictate
      punchesPerRow: 5,
    },
  },
  "WindowsPink.png": {
    title: {
      top: "15%", // Adjust these for WindowsPink.png
      left: "10%",
      textAlign: "left",
      color: "#333",
      fontSize: "2.8rem",
      fontWeight: "bold",
      width: "80%",
    },
    description: {
      top: "35%",
      left: "10%",
      textAlign: "left",
      color: "#555",
      fontSize: "1.1rem",
      width: "75%",
    },
    // You could add punchGrid: { top: '50%', ... } here too if needed
  },
};

const CreatePunchPass = () => {
  const [selectedBackground, setSelectedBackground] =
    useState("WindowsGreen.png");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon1, setSelectedIcon1] = useState("bunny.png");
  const [selectedIcon2, setSelectedIcon2] = useState("shoe.png");
  const [isDailyPunch, setIsDailyPunch] = useState(false);

  const iconList = [
    { name: "None", value: "" },
    { name: "Bunny", value: "bunny.png" },
    { name: "Shoe", value: "shoe.png" },
    { name: "Dumbbell", value: "dumbbell.png" },
    { name: "Paintbrush", value: "paintbrush.png" },
    { name: "Star", value: "⭐" },
    { name: "Heart", value: "❤️" },
  ];

  const getBackgroundImage = (backgroundName) => {
    switch (backgroundName) {
      case "WindowsGreen.png":
        return GreenWindows;
      case "WindowsPink.png":
        return PinkWindows;
      default:
        return GreenWindows; // Fallback
    }
  };

  const handleCreatePunchPass = () => {
    console.log("Creating Punch Pass with:", {
      selectedBackground,
      title,
      description,
      selectedIcon1,
      selectedIcon2,
      isDailyPunch,
    });
    alert("Punch Pass creation simulated! Check console for data.");
  };

  const handleSaveDraft = () => {
    console.log("Saving draft with current settings.");
    alert("Draft saved (simulated)!");
  };

  // Get the current layout configuration based on selected background
  const currentLayout = backgroundLayouts[selectedBackground] || {}; // Fallback to empty object

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 flex flex-col items-center">
        {/* Preview Card */}
        <div className="w-full flex justify-center mb-10">
          <div
            className="relative rounded-2xl shadow-xl overflow-hidden flex-shrink-0"
            style={{
              width: "1004px",
              height: "591px",
            }}
          >
            <PunchCardPreview
              name={title}
              description={description}
              icon1={iconMap[selectedIcon1] || selectedIcon1}
              icon2={iconMap[selectedIcon2] || selectedIcon2}
              cardImage={getBackgroundImage(selectedBackground)}
              isDailyPunch={isDailyPunch}
              titlePlacement={currentLayout.title}
              descriptionPlacement={currentLayout.description}
            />
          </div>
        </div>

        {/* Editing Controls */}
        <div className="w-full bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg flex flex-col gap-6 mb-8">
          {/* Background Selector */}
          <div>
            <label
              htmlFor="background-select"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Background:
            </label>
            <select
              id="background-select"
              value={selectedBackground}
              onChange={(e) => setSelectedBackground(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
            >
              <option value="WindowsGreen.png">Green Windows</option>
              <option value="WindowsPink.png">Pink Windows</option>
            </select>
          </div>

          {/* Title Input */}
          <div>
            <label
              htmlFor="title-input"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Title:
            </label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter punch pass title"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Description Input */}
          <div>
            <label
              htmlFor="description-input"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Description:
            </label>
            <textarea
              id="description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter punch pass description"
              rows="3"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Icon Pickers */}
          <div>
            <div className="font-semibold text-gray-700 mb-2">
              Choose Icon 1:
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              {iconList.map((icon) => (
                <div
                  key={icon.value}
                  onClick={() => setSelectedIcon1(icon.value)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer border-2 ${
                    selectedIcon1 === icon.value
                      ? "border-pink-500"
                      : "border-transparent"
                  }`}
                >
                  {icon.value ? (
                    icon.value.includes(".png") || icon.value.includes(".svg") ? (
                      <img
                        src={iconMap[icon.value] || icon.value}
                        alt={icon.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span className="text-2xl">{icon.value}</span>
                    )
                  ) : null}
                </div>
              ))}
            </div>
            <div className="font-semibold text-gray-700 mb-2">
              Choose Icon 2:
            </div>
            <div className="flex flex-wrap gap-4">
              {iconList.map((icon) => (
                <div
                  key={icon.value}
                  onClick={() => setSelectedIcon2(icon.value)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer border-2 ${
                    selectedIcon2 === icon.value
                      ? "border-pink-500"
                      : "border-transparent"
                  }`}
                >
                  {icon.value ? (
                    icon.value.includes(".png") || icon.value.includes(".svg") ? (
                      <img
                        src={iconMap[icon.value] || icon.value}
                        alt={icon.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span className="text-2xl">{icon.value}</span>
                    )
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Punch Checkbox */}
          <div className="flex items-center">
            <input
              id="daily-punch-checkbox"
              type="checkbox"
              checked={isDailyPunch}
              onChange={(e) => setIsDailyPunch(e.target.checked)}
              className="h-5 w-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
            />
            <label
              htmlFor="daily-punch-checkbox"
              className="ml-2 block text-sm font-semibold text-gray-700"
            >
              Daily Punch
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <button
            onClick={handleCreatePunchPass}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Create Punch Pass
          </button>
          <button
            onClick={handleSaveDraft}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Save Draft
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePunchPass;