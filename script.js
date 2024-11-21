document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    const subTabButtons = document.querySelectorAll(".sub-tab-button");
    const subTabContents = document.querySelectorAll(".sub-tab-content");

    // Switch between main tabs (Visualization, Knowledge Base, Cell Data, etc.)
    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Deactivate all main tabs and contents
            tabContents.forEach((content) => content.classList.remove("active"));
            tabButtons.forEach((btn) => btn.classList.remove("active"));

            // Activate the selected main tab
            const tabId = button.getAttribute("data-tab");
            const selectedTabContent = document.getElementById(tabId);

            if (selectedTabContent) {
                selectedTabContent.classList.add("active");
            }

            button.classList.add("active");

            // Handle tabs with sub-tabs (like Cell Data)
            if (tabId === "cellDataTab") {
                // If it's the Cell Data tab, activate the default sub-tab
                activateSubTab("powerTab");
            } else {
                // For tabs like Visualization and Knowledge Base (without sub-tabs)
                // Make sure the sub-tab content is hidden (if visible previously)
                subTabContents.forEach((content) => content.classList.remove("active"));
            }
        });
    });

    // Switch between sub-tabs within the Cell Data tab (Power and Chemistry)
    subTabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const subTabId = button.getAttribute("data-sub-tab");
            activateSubTab(subTabId);
        });
    });

    // Function to activate sub-tab within the Cell Data tab
    const activateSubTab = (subTabId) => {
        subTabContents.forEach((content) => content.classList.remove("active"));
        subTabButtons.forEach((btn) => btn.classList.remove("active"));

        const selectedSubTab = document.getElementById(subTabId);
        const selectedSubTabButton = document.querySelector(`.sub-tab-button[data-sub-tab="${subTabId}"]`);

        if (selectedSubTab) {
            selectedSubTab.classList.add("active");
        }

        if (selectedSubTabButton) {
            selectedSubTabButton.classList.add("active");
        }
    };

    // Set default active tab to Cell Data
    document.querySelector('.tab-button[data-tab="cellDataTab"]').click();

    // Power and Chemistry Parameter Controls
    const currentSlider = document.getElementById("current");
    const acdSlider = document.getElementById("acd");
    const temperatureSlider = document.getElementById("temperature");
    const voltageSlider = document.getElementById("voltageSlider");

    const currentValueDisplay = document.getElementById("currentValue");
    const acdValueDisplay = document.getElementById("acdValue");
    const temperatureValueDisplay = document.getElementById("temperatureValue");
    const voltageValueDisplay = document.getElementById("voltageValue");

    // Chemistry controls
    const aluminaSlider = document.getElementById("alumina");
    const na2oSlider = document.getElementById("na2o");
    const caoSlider = document.getElementById("cao");
    const loiSlider = document.getElementById("loi");
    const alf3Slider = document.getElementById("alf3");

    const aluminaValueDisplay = document.getElementById("aluminaValue");
    const na2oValueDisplay = document.getElementById("na2oValue");
    const caoValueDisplay = document.getElementById("caoValue");
    const loiValueDisplay = document.getElementById("loiValue");
    const alf3ValueDisplay = document.getElementById("alf3Value");

    // Update power results function
    let currentEfficiencyDrop = 0;
    let energyDrop = 0;

    const updatePowerResults = () => {
        const userEfficiency = parseFloat(document.getElementById("currentEfficiency").value); // User-provided CE
        const currentEfficiency = Math.max(0, userEfficiency - currentEfficiencyDrop); // Subtract drop, ensure CE is not negative

        const theoreticalProduction = (8.0537 * currentSlider.value); // Calculate theoretical production
        const production = (theoreticalProduction * currentEfficiency) / 100; // Adjust by actual CE
        const sec = (voltageSlider.value * currentSlider.value * 24) / production; 
        const energyEfficiency = sec + energyDrop;

        // Update output
        document.getElementById("ce").textContent = currentEfficiency.toFixed(2);
        document.getElementById("production").textContent = production.toFixed(2);
        document.getElementById("sec").textContent = energyEfficiency.toFixed(2);
    };

    const updateChemistryResults = () => {
        const alumina = parseFloat(aluminaSlider.value);
        const alf3 = parseFloat(alf3Slider.value);
        const na2o = parseFloat(na2oSlider.value);
        const cao = parseFloat(caoSlider.value);
        const loi = parseFloat(loiSlider.value);
        const userEfficiency = parseFloat(document.getElementById("currentEfficiency").value);

        const ceDrop = (na2o + cao) * 0.5;
        const affectedCurrentEfficiency = Math.max(0, userEfficiency - ceDrop); 
        const bathRatio = alf3 / alumina; 
        const bathTemperatureEffect = 960 + (bathRatio * 10); 
        const solubility = (alumina / (alumina + alf3)) * 100; 
        const bathResistance = 1.6 + (bathRatio * 0.05);
        const energyEfficiencyDrop = (na2o + cao + loi) * 0.02;

        currentEfficiencyDrop = ceDrop;

        document.getElementById("optimalAlumina").textContent = alumina.toFixed(2);
        document.getElementById("bathEfficiency").textContent = bathRatio.toFixed(2);
        document.getElementById("bathResistance").textContent = bathResistance.toFixed(2);
        document.getElementById("bathTemperature").textContent = bathTemperatureEffect.toFixed(2);
        document.getElementById("solubility").textContent = solubility.toFixed(2);
        document.getElementById("energyEfficiencyDrop").textContent = energyEfficiencyDrop.toFixed(2);
        document.getElementById("currentEfficiencyDrop").textContent = currentEfficiencyDrop.toFixed(2);
        document.getElementById("affectedCurrentEfficiency").textContent = affectedCurrentEfficiency.toFixed(2);

        updatePowerResults();
    };

const loadSavedValues = () => {
    const savedValues = JSON.parse(localStorage.getItem("powerValues"));
    if (savedValues) {
        currentSlider.value = savedValues.current;
        acdSlider.value = savedValues.acd;
        temperatureSlider.value = savedValues.temperature;
        voltageSlider.value = savedValues.voltage; // Ensure voltageSlider is updated
        document.getElementById("currentEfficiency").value = savedValues.currentEfficiency;

        currentValueDisplay.textContent = savedValues.current;
        acdValueDisplay.textContent = savedValues.acd;
        temperatureValueDisplay.textContent = savedValues.temperature;
        voltageValueDisplay.textContent = savedValues.voltage;

        // Update the voltage value in the Expected Results section
        document.getElementById("voltageDisplay").textContent = savedValues.voltage;

        // Recalculate the Expected Results using the saved data
        updatePowerResults();
    }
};


    const loadSavedChemistryValues = () => {
        const savedChemistryValues = JSON.parse(localStorage.getItem("chemistryValues"));
        if (savedChemistryValues) {
            aluminaSlider.value = savedChemistryValues.alumina;
            na2oSlider.value = savedChemistryValues.na2o;
            caoSlider.value = savedChemistryValues.cao;
            loiSlider.value = savedChemistryValues.loi;
            alf3Slider.value = savedChemistryValues.alf3;

            aluminaValueDisplay.textContent = savedChemistryValues.alumina;
            na2oValueDisplay.textContent = savedChemistryValues.na2o;
            caoValueDisplay.textContent = savedChemistryValues.cao;
            loiValueDisplay.textContent = savedChemistryValues.loi;
            alf3ValueDisplay.textContent = savedChemistryValues.alf3;

            updateChemistryResults();
        }
    };

    const saveValuesToLocalStorage = () => {
        const values = {
            current: currentSlider.value,
            acd: acdSlider.value,
            temperature: temperatureSlider.value,
            voltage: voltageSlider.value,
            currentEfficiency: document.getElementById("currentEfficiency").value,
        };
        localStorage.setItem("powerValues", JSON.stringify(values));
    };

    const saveChemistryValuesToLocalStorage = () => {
        const chemistryValues = {
            alumina: aluminaSlider.value,
            na2o: na2oSlider.value,
            cao: caoSlider.value,
            loi: loiSlider.value,
            alf3: alf3Slider.value,
        };
        localStorage.setItem("chemistryValues", JSON.stringify(chemistryValues));
    };

    currentSlider.addEventListener("input", () => {
        currentValueDisplay.textContent = currentSlider.value;
        updatePowerResults();
        saveValuesToLocalStorage();
    });

    acdSlider.addEventListener("input", () => {
        acdValueDisplay.textContent = acdSlider.value;
        updatePowerResults();
        saveValuesToLocalStorage();
    });

    temperatureSlider.addEventListener("input", () => {
        temperatureValueDisplay.textContent = temperatureSlider.value;
        updatePowerResults();
        saveValuesToLocalStorage();
    });

    voltageSlider.addEventListener("input", () => {
        voltageValueDisplay.textContent = voltageSlider.value;
        document.getElementById("voltageDisplay").textContent = voltageSlider.value; // Corrected to update in both sections
        updatePowerResults();
        saveValuesToLocalStorage();
    });

    aluminaSlider.addEventListener("input", () => {
        aluminaValueDisplay.textContent = aluminaSlider.value;
        updateChemistryResults();
        saveChemistryValuesToLocalStorage();
    });

    na2oSlider.addEventListener("input", () => {
        na2oValueDisplay.textContent = na2oSlider.value;
        updateChemistryResults();
        saveChemistryValuesToLocalStorage();
    });

    caoSlider.addEventListener("input", () => {
        caoValueDisplay.textContent = caoSlider.value;
        updateChemistryResults();
        saveChemistryValuesToLocalStorage();
    });

    loiSlider.addEventListener("input", () => {
        loiValueDisplay.textContent = loiSlider.value;
        updateChemistryResults();
        saveChemistryValuesToLocalStorage();
    });

    alf3Slider.addEventListener("input", () => {
        alf3ValueDisplay.textContent = alf3Slider.value;
        updateChemistryResults();
        saveChemistryValuesToLocalStorage();
    });

    const ceInputField = document.getElementById("currentEfficiency");
    ceInputField.addEventListener("input", () => {
        let ceValue = parseFloat(ceInputField.value);

        if (ceValue < 0) ceValue = 0;
        if (ceValue > 100) ceValue = 100;

        ceInputField.value = ceValue;

        updatePowerResults();
        saveValuesToLocalStorage();
    });

    loadSavedValues();
    loadSavedChemistryValues();

    const savePdfButton = document.getElementById("savePdf");
    savePdfButton.addEventListener("click", () => {
        const element = document.querySelector(".container");
        const options = {
            margin: 10,
            filename: "VALCO_Cell_Simulator_Results.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { dpi: 192, letterRendering: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };
        html2pdf().from(element).set(options).save();
    });
});
