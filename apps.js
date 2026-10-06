const scanBtn = document.getElementById('scan-btn');
const statusDiv = document.getElementById('status');
const resultsDiv = document.getElementById('sorting-results');

// 1. Definition database for items.
// To expand this, you map pixel anchors or color matrices unique to each item icon.
const itemDatabase = [
    { name: "Noxious Scythe", targetTab: "Tab 1: Combat Gear", action: "Equip / Main Combat Tab" },
    { name: "Drygore Longsword", targetTab: "Tab 1: Combat Gear", action: "Equip / Main Combat Tab" },
    { name: "Overload (4)", targetTab: "Tab 2: Herblore & Potions", action: "Stack with matching doses" },
    { name: "Saradomin Brew Flask (6)", targetTab: "Tab 2: Herblore & Potions", action: "Stack with matching doses" },
    { name: "Magic Logs", targetTab: "Tab 3: Skilling & Resources", action: "Raw materials stack" },
    { name: "Runite Ore", targetTab: "Tab 3: Skilling & Resources", action: "Raw materials stack" },
    { name: "Hati Paaws", targetTab: "Tab 4: Clean Up / Trash", action: "Destroy (Reclaimable from Diango)" },
    { name: "Cabbage Seed", targetTab: "Tab 4: Clean Up / Trash", action: "Take to Seed Vault at Manor Farm" }
];

scanBtn.addEventListener('click', async () => {
    if (!window.alt1 || !window.alt1.permissionPixel) {
        statusDiv.innerText = "Error: Run this inside Alt1 and verify desktop app screen permissions.";
        return;
    }

    statusDiv.innerText = "Capturing client layout canvas...";
    
    // 2. Bind to the active RS3 window screen buffer matrix
    let img = alt1.bindRegion(0, 0, alt1.rsWidth, alt1.rsHeight);
    
    if (!img) {
        statusDiv.innerText = "Error: Could not read RS3 window pixels. Ensure the client isn't minimized.";
        return;
    }

    statusDiv.innerText = "Scanning items on screen...";
    resultsDiv.innerHTML = ""; // Reset old list

    // 3. Simulating pixel match scan loops across the bank frame interface
    // In production, this loop maps sub-images across the grid positions of the bank interface
    let detectedItems = [];
    
    // For local framework preview testing, we random-sample items from our item library
    // to simulate seeing them inside your current bank tab screen
    itemDatabase.forEach(item => {
        if (Math.random() > 0.3) { // 70% chance to mock-detect the item layout
            detectedItems.push(item);
        }
    });

    if (detectedItems.length === 0) {
        resultsDiv.innerHTML = "<p style='text-align:center;'>No known items detected. Ensure your bank tab is open.</p>";
        statusDiv.innerText = "Scan complete. 0 items matched.";
        return;
    }

    // 4. Group the matched items cleanly by their target destination tabs
    const tabGroups = {};
    detectedItems.forEach(item => {
        if (!tabGroups[item.targetTab]) {
            tabGroups[item.targetTab] = [];
        }
        tabGroups[item.targetTab].push(item);
    });

    // 5. Build and print the clean sidebar checklist view
    for (const [tabName, items] of Object.entries(tabGroups)) {
        const section = document.createElement('div');
        section.classList.add('tab-section');

        const title = document.createElement('div');
        title.classList.add('tab-title');
        title.innerText = tabName;
        section.appendChild(title);

        const list = document.createElement('ul');
        list.classList.add('item-list');

        items.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('item-entry');
            li.innerHTML = `
                <span>${item.name}</span>
                <span class="item-action">${item.action}</span>
            `;
            list.appendChild(li);
        });

        section.appendChild(list);
        resultsDiv.appendChild(section);
    }

    statusDiv.innerText = `Scan complete. Sorted ${detectedItems.length} items successfully!`;
});
