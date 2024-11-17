document.addEventListener("DOMContentLoaded", () => {
    // Tabs logic
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Hide all tab contents
            tabContents.forEach((content) => content.classList.remove("active"));

            // Remove active class from all tab buttons
            tabButtons.forEach((btn) => btn.classList.remove("active"));

            // Show selected tab content
            const tabId = button.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");

            // Add active class to the clicked tab
            button.classList.add("active");
        });
    });

    // Select default tab
    tabButtons[0].click();

    // Sliders and dynamic updates
    const currentSlider = document.getElementById("current");
    const acdSlider = document.getElementById("acd");
    const tempSlider = document.getElementById("temperature");
    const voltageSlider = document.getElementById("voltageSlider");

    const currentValue = document.getElementById("currentValue");
    const acdValue = document.getElementById("acdValue");
    const tempValue = document.getElementById("temperatureValue");
    const voltageValue = document.getElementById("voltageValue");

    const ceDisplay = document.getElementById("ce");
    const productionDisplay = document.getElementById("production");
    const secDisplay = document.getElementById("sec");
    const voltageDisplay = document.getElementById("voltageDisplay");

    // Constants
    const LINE_KA_TO_AMPS = 1000; // Convert line current from kA to A

    // Function to update all the values dynamically based on relations
    const updateValues = () => {
        const current = parseFloat(currentSlider.value); // Line current in kA
        const acd = parseFloat(acdSlider.value);
        const temp = parseFloat(tempSlider.value);
        const voltage = parseFloat(voltageSlider.value);

        // Update the display values for the sliders
        currentValue.textContent = current;
        acdValue.textContent = acd;
        tempValue.textContent = temp;
        voltageValue.textContent = voltage.toFixed(1);

        // 1. Calculate Current Efficiency (CE)
        // Formula: CE = 8.0537 * Line Current (kA)
        const currentEfficiency = 8.0537 * current;

        // 2. Calculate Production (kg/day)
        // Theoretical production: 8.0537 * current (since it scales with CE)
        // Actual mass (production) in kg/day is proportional to CE
        const actualMassKg = currentEfficiency; // kg/day

        // 3. Calculate Specific Energy Consumption (SEC)
        // Formula: SEC = (2.98 * Avg. Cell Voltage) / Current Efficiency
        const SEC = (2.98 * voltage) / currentEfficiency;

        // Update the results
        ceDisplay.textContent = currentEfficiency.toFixed(2);
        voltageDisplay.textContent = voltage.toFixed(1);
        productionDisplay.textContent = actualMassKg.toFixed(2);
        secDisplay.textContent = SEC.toFixed(2);
    };

    // Event Listeners for Sliders
    currentSlider.addEventListener("input", updateValues);
    acdSlider.addEventListener("input", updateValues);
    tempSlider.addEventListener("input", updateValues);
    voltageSlider.addEventListener("input", updateValues);

    // Initial update
    updateValues();
});
