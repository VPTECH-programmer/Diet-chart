/**
 * SHAPE SQUAD FITNESS CENTRE - DIET CHART GENERATOR
 * Plain HTML / CSS / JavaScript
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // CONSTANTS
  // -------------------------------------------------------------------------
  const STORAGE_KEY_DIET = 'shapesquad_diet_data_v3';
  const STORAGE_KEY_GYM = 'shapesquad_gym_profile_v3';

  // Default Gym Profile
  const DEFAULT_GYM_PROFILE = {
    name: 'Shape Squad Fitness Centre',
    tagline: 'TRAIN HARD • EAT RIGHT • LIVE STRONG',
    address: 'Anantpur, Rewa – 486002',
    phone: '+91 88711 82361',
    email: 'shapesquadteam@gmail.com',
    trainerName: 'Vipin Pandey',
    logoDataUri: './logo.png'
  };

  // Default 9 meal rows
  const DEFAULT_MEAL_ROWS = [
    {
      timing: 'Breakfast',
      time: '07:00',
      itemName: 'Oatmeal with Banana',
      quantity: '100g + 1 pc',
      protein: 5,
      fats: 2.5,
      carbs: 27,
      calories: 150
    },
    {
      timing: 'Mid-Morning Snack',
      time: '10:00',
      itemName: 'Boiled Eggs',
      quantity: '2 nos',
      protein: 12,
      fats: 10,
      carbs: 1,
      calories: 143
    },
    {
      timing: 'Lunch',
      time: '13:00',
      itemName: 'Brown Rice + Chicken',
      quantity: '150g + 150g',
      protein: 40,
      fats: 6,
      carbs: 45,
      calories: 400
    },
    {
      timing: 'Pre-Workout',
      time: '16:30',
      itemName: 'Banana + Peanut Butter',
      quantity: '1 pc + 1 tbsp',
      protein: 5,
      fats: 8,
      carbs: 30,
      calories: 220
    },
    {
      timing: 'Post-Workout',
      time: '19:00',
      itemName: 'Whey Protein Shake',
      quantity: '30g scoop',
      protein: 25,
      fats: 1,
      carbs: 3,
      calories: 120
    },
    {
      timing: 'Dinner',
      time: '21:00',
      itemName: 'Grilled Fish + Veggies',
      quantity: '200g + 100g',
      protein: 35,
      fats: 5,
      carbs: 12,
      calories: 240
    },
    {
      timing: '',
      time: '',
      itemName: '',
      quantity: '',
      protein: '',
      fats: '',
      carbs: '',
      calories: ''
    },
    {
      timing: '',
      time: '',
      itemName: '',
      quantity: '',
      protein: '',
      fats: '',
      carbs: '',
      calories: ''
    },
    {
      timing: '',
      time: '',
      itemName: '',
      quantity: '',
      protein: '',
      fats: '',
      carbs: '',
      calories: ''
    }
  ];

  // Common Indian Fitness Foods Database for Autocomplete & Quick Autofill
  const INDIAN_FOODS_DB = [
    { name: 'Oatmeal with Banana', qty: '100g + 1 pc', p: 5, f: 2.5, c: 27, cal: 150 },
    { name: 'Boiled Eggs', qty: '2 nos', p: 12, f: 10, c: 1, cal: 143 },
    { name: 'Brown Rice + Chicken', qty: '150g + 150g', p: 40, f: 6, c: 45, cal: 400 },
    { name: 'Banana + Peanut Butter', qty: '1 pc + 1 tbsp', p: 5, f: 8, c: 30, cal: 220 },
    { name: 'Whey Protein Shake', qty: '30g scoop', p: 25, f: 1, c: 3, cal: 120 },
    { name: 'Grilled Fish + Veggies', qty: '200g + 100g', p: 35, f: 5, c: 12, cal: 240 },
    { name: 'Raw Paneer', qty: '100g', p: 18, f: 20, c: 4, cal: 265 },
    { name: 'Paneer Bhurji', qty: '150g + Veggies', p: 20, f: 22, c: 6, cal: 300 },
    { name: 'Egg Whites (6)', qty: '6 Boiled Whites', p: 24, f: 0.5, c: 1, cal: 105 },
    { name: 'Whole Wheat Roti (2)', qty: '2 rotis', p: 6, f: 1, c: 32, cal: 160 },
    { name: 'Yellow Moong Dal', qty: '1 bowl (150g)', p: 9, f: 3, c: 20, cal: 143 },
    { name: 'Soya Chunks Curry', qty: '50g dry chunks', p: 26, f: 1, c: 16, cal: 177 },
    { name: 'Curd / Dahi', qty: '200g bowl', p: 8, f: 6, c: 9, cal: 122 },
    { name: 'Greek Yogurt', qty: '150g cup', p: 15, f: 3, c: 6, cal: 111 },
    { name: 'Sprouted Moong Salad', qty: '1 bowl', p: 10, f: 1, c: 22, cal: 137 },
    { name: 'Almonds & Walnuts', qty: '30g mix', p: 6, f: 16, c: 5, cal: 188 },
    { name: 'Boiled Sweet Potato', qty: '150g', p: 2, f: 0.5, c: 30, cal: 132 },
    { name: 'Besan Chilla', qty: '2 medium chillas', p: 12, f: 6, c: 28, cal: 214 },
    { name: 'Poha with Peanuts', qty: '1 bowl', p: 6, f: 8, c: 42, cal: 264 }
  ];

  const MEAL_TIMINGS = [
    'Early Morning',
    'Breakfast',
    'Mid-Morning Snack',
    'Lunch',
    'Evening Snack',
    'Pre-Workout',
    'Post-Workout',
    'Dinner',
    'Before Bed'
  ];

  // -------------------------------------------------------------------------
  // APPLICATION STATE
  // -------------------------------------------------------------------------
  let state = {
    gym: { ...DEFAULT_GYM_PROFILE },
    client: {
      name: 'Client Name',
      trainer: 'Vipin Pandey',
      date: 'DD/MM/YYYY',
      goal: 'e.g. Weight Loss / Muscle Gain'
    },
    mealRows: JSON.parse(JSON.stringify(DEFAULT_MEAL_ROWS)),
    instructionsText: 'e.g. Drink 3–4 litres of water daily. Avoid processed sugar. Take meals every 3 hours...',
    autoCalcCalories: false,
    macroSplitMode: 'grams'
  };

  function getTodayFormatted() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function loadStoredData() {
    try {
      const storedGym = localStorage.getItem(STORAGE_KEY_GYM);
      if (storedGym) {
        state.gym = Object.assign({}, DEFAULT_GYM_PROFILE, JSON.parse(storedGym));
      }
      const storedDiet = localStorage.getItem(STORAGE_KEY_DIET);
      if (storedDiet) {
        const parsed = JSON.parse(storedDiet);
        if (parsed.client) state.client = Object.assign({}, state.client, parsed.client);
        if (parsed.mealRows && Array.isArray(parsed.mealRows) && parsed.mealRows.length > 0) {
          state.mealRows = parsed.mealRows;
        }
        if (typeof parsed.instructionsText === 'string') {
          state.instructionsText = parsed.instructionsText;
        }
        if (typeof parsed.autoCalcCalories === 'boolean') {
          state.autoCalcCalories = parsed.autoCalcCalories;
        }
        if (parsed.macroSplitMode === 'grams' || parsed.macroSplitMode === 'calories') {
          state.macroSplitMode = parsed.macroSplitMode;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
  }

  function saveStateToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_GYM, JSON.stringify(state.gym));
      localStorage.setItem(STORAGE_KEY_DIET, JSON.stringify({
        client: state.client,
        mealRows: state.mealRows,
        instructionsText: state.instructionsText,
        autoCalcCalories: state.autoCalcCalories,
        macroSplitMode: state.macroSplitMode
      }));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  // -------------------------------------------------------------------------
  // LOGO INITIALIZATION (loads ./logo.png from the app folder)
  // -------------------------------------------------------------------------
  function initLogoImage(showFeedback = false) {
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';
    testImg.onload = function () {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = testImg.naturalWidth || 200;
        canvas.height = testImg.naturalHeight || 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(testImg, 0, 0);
        const b64 = canvas.toDataURL('image/png');
        if (b64 && b64.length > 100) {
          state.gym.logoDataUri = b64;
          renderGymHeader();
          saveStateToStorage();
          if (showFeedback) showToast('Loaded logo.png from folder (circular cropped)', 'success');
          return;
        }
      } catch (err) {
        // file:// cross-origin canvas security restriction fallback
      }
      state.gym.logoDataUri = './logo.png';
      renderGymHeader();
      if (showFeedback) showToast('Loaded logo.png from folder (circular cropped)', 'success');
    };
    testImg.onerror = function () {
      if (showFeedback) {
        showToast('Could not load logo.png from folder. Please ensure logo.png is in the app directory.', 'error');
      } else if (!state.gym.logoDataUri) {
        state.gym.logoDataUri = './logo.png';
        renderGymHeader();
      }
    };
    testImg.src = './logo.png';
  }

  // -------------------------------------------------------------------------
  // DOM REFERENCES
  // -------------------------------------------------------------------------
  let els = {};

  function initDOMElements() {
    els = {
      // Header
      gymName: document.getElementById('gymNameDisplay'),
      gymTagline: document.getElementById('gymTaglineDisplay'),
      gymAddress: document.getElementById('gymAddressDisplay'),
      gymPhone: document.getElementById('gymPhoneDisplay'),
      gymEmail: document.getElementById('gymEmailDisplay'),
      gymLogoBadge: document.getElementById('gymLogoBadge'),
      chartWatermark: document.getElementById('chartWatermark'),
      btnEditGym: document.getElementById('btnEditGym'),

      // Client Info
      clientName: document.getElementById('clientNameInput'),
      trainerName: document.getElementById('trainerNameInput'),
      chartDate: document.getElementById('chartDateInput'),
      clientGoal: document.getElementById('clientGoalInput'),

      // Table & Cards
      tableBody: document.getElementById('dietTableBody'),
      mobileCardsContainer: document.getElementById('mobileCardsContainer'),
      btnAddMealRow: document.getElementById('btnAddMealRow'),
      btnAddMealRowMobile: document.getElementById('btnAddMealRowMobile'),
      autoCalcToggle: document.getElementById('autoCalcToggle'),

      // Totals
      totalProtein: document.getElementById('totalProteinVal'),
      totalFats: document.getElementById('totalFatsVal'),
      totalCarbs: document.getElementById('totalCarbsVal'),
      totalCalories: document.getElementById('totalCaloriesVal'),

      // Macronutrient Breakdown (D3)
      macroBreakdownRow: document.getElementById('macroBreakdownRow'),
      macroBreakdownContainer: document.getElementById('macroBreakdownContainer'),
      macroTotalMassBadge: document.getElementById('macroTotalMassBadge'),
      btnSplitGrams: document.getElementById('btnSplitGrams'),
      btnSplitCalories: document.getElementById('btnSplitCalories'),
      d3MacroDonutChart: document.getElementById('d3MacroDonutChart'),
      d3MacroBarChart: document.getElementById('d3MacroBarChart'),
      proteinPctVal: document.getElementById('proteinPctVal'),
      proteinGramsVal: document.getElementById('proteinGramsVal'),
      proteinCalsVal: document.getElementById('proteinCalsVal'),
      fatsPctVal: document.getElementById('fatsPctVal'),
      fatsGramsVal: document.getElementById('fatsGramsVal'),
      fatsCalsVal: document.getElementById('fatsCalsVal'),
      carbsPctVal: document.getElementById('carbsPctVal'),
      carbsGramsVal: document.getElementById('carbsGramsVal'),
      carbsCalsVal: document.getElementById('carbsCalsVal'),
      mobileMacroBreakdownContainer: document.getElementById('mobileMacroBreakdownContainer'),

      // Instructions
      instructionsTextarea: document.getElementById('instructionsTextarea'),

      // Toolbar Buttons
      btnPrintChart: document.getElementById('btnPrintChart'),
      btnSavePDF: document.getElementById('btnSavePDF'),
      btnExportExcel: document.getElementById('btnExportExcel'),
      btnResetTable: document.getElementById('btnResetTable'),
      btnNewClient: document.getElementById('btnNewClient'),

      // Mobile Bottom Bar
      mBtnPrint: document.getElementById('mBtnPrint'),
      mBtnPDF: document.getElementById('mBtnPDF'),
      mBtnExcel: document.getElementById('mBtnExcel'),
      mBtnReset: document.getElementById('mBtnReset'),
      mBtnNewClient: document.getElementById('mBtnNewClient'),

      // Modals
      gymModal: document.getElementById('gymModalOverlay'),
      gymModalClose: document.getElementById('gymModalClose'),
      gymModalCancel: document.getElementById('gymModalCancel'),
      gymModalSave: document.getElementById('gymModalSave'),
      gymInputName: document.getElementById('gymInputName'),
      gymInputTagline: document.getElementById('gymInputTagline'),
      gymInputAddress: document.getElementById('gymInputAddress'),
      gymInputPhone: document.getElementById('gymInputPhone'),
      gymInputEmail: document.getElementById('gymInputEmail'),
      gymInputTrainer: document.getElementById('gymInputTrainer'),
      gymLogoFileInput: document.getElementById('gymLogoFileInput'),
      btnReloadFolderLogo: document.getElementById('btnReloadFolderLogo'),
      btnResetDefaultLogo: document.getElementById('btnResetDefaultLogo'),

      resetModal: document.getElementById('resetModalOverlay'),
      resetModalCancel: document.getElementById('resetModalCancel'),
      resetModalConfirm: document.getElementById('resetModalConfirm'),

      toastContainer: document.getElementById('toastContainer'),
      foodDatalist: document.getElementById('foodSuggestionsDatalist')
    };
  }

  // -------------------------------------------------------------------------
  // RENDER VIEWS
  // -------------------------------------------------------------------------
  function renderAll() {
    renderGymHeader();
    renderClientFields();
    renderDietTableRows();
    renderMobileCards();
    renderInstructions();
    calculateAndRenderTotals();
  }

  function renderGymHeader() {
    if (els.gymName) els.gymName.textContent = state.gym.name;
    if (els.gymTagline) els.gymTagline.textContent = state.gym.tagline;
    if (els.gymAddress) els.gymAddress.textContent = state.gym.address;
    if (els.gymPhone) els.gymPhone.textContent = state.gym.phone;
    if (els.gymEmail) els.gymEmail.textContent = state.gym.email;

    // Guaranteed circular crop for square or arbitrary aspect ratio logos
    const logoHtml = `<div class="logo-badge" style="width:56px; height:56px; border-radius:50%; overflow:hidden; border:2.5px solid #FFFFFF; box-shadow:0 0 10px rgba(56,189,248,0.6); display:flex; align-items:center; justify-content:center; padding:0; background:#07152B;">
      <img src="${state.gym.logoDataUri}" alt="${escapeHtml(state.gym.name)} Logo" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;" />
    </div>`;
    if (els.gymLogoBadge) els.gymLogoBadge.innerHTML = logoHtml;
    if (els.chartWatermark) {
      els.chartWatermark.innerHTML = `<img src="${state.gym.logoDataUri}" alt="Watermark" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;" />`;
    }
  }

  function renderClientFields() {
    if (els.clientName) els.clientName.value = state.client.name || 'Client Name';
    if (els.trainerName) els.trainerName.value = state.client.trainer || state.gym.trainerName;
    if (els.chartDate) els.chartDate.value = state.client.date || 'DD/MM/YYYY';
    if (els.clientGoal) els.clientGoal.value = state.client.goal || 'e.g. Weight Loss / Muscle Gain';
    if (els.autoCalcToggle) els.autoCalcToggle.checked = state.autoCalcCalories;
  }

  function renderInstructions() {
    if (els.instructionsTextarea) {
      els.instructionsTextarea.value = state.instructionsText || '';
    }
  }

  function populateFoodDatalist() {
    if (!els.foodDatalist) return;
    els.foodDatalist.innerHTML = '';
    INDIAN_FOODS_DB.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.name;
      opt.label = `${item.qty} | P:${item.p}g F:${item.f}g C:${item.c}g (${item.cal} kcal)`;
      els.foodDatalist.appendChild(opt);
    });
  }

  // Render Desktop Table Rows
  function renderDietTableRows() {
    if (!els.tableBody) return;
    els.tableBody.innerHTML = '';

    state.mealRows.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.dataset.index = index;

      tr.innerHTML = `
        <td class="col-sno">
          ${index + 1}
        </td>
        <td class="col-timing">
          <input type="text" list="mealTimingOptions" class="cell-input" value="${escapeHtml(row.timing || '')}" 
                 placeholder="" data-field="timing" data-index="${index}" />
        </td>
        <td class="col-time">
          <input type="text" class="cell-input time-picker" value="${escapeHtml(row.time || '')}" 
                 placeholder="" data-field="time" data-index="${index}" />
        </td>
        <td class="col-item">
          <input type="text" list="foodSuggestionsDatalist" class="cell-input item-name-input" 
                 value="${escapeHtml(row.itemName || '')}" 
                 placeholder="" data-field="itemName" data-index="${index}" />
        </td>
        <td class="col-qty">
          <input type="text" class="cell-input" value="${escapeHtml(row.quantity || '')}" 
                 placeholder="" data-field="quantity" data-index="${index}" />
        </td>
        <td class="col-macro">
          <input type="text" inputmode="decimal" class="cell-input numeric" 
                 value="${row.protein !== '' && row.protein !== undefined ? row.protein : ''}" data-field="protein" data-index="${index}" />
        </td>
        <td class="col-macro">
          <input type="text" inputmode="decimal" class="cell-input numeric" 
                 value="${row.fats !== '' && row.fats !== undefined ? row.fats : ''}" data-field="fats" data-index="${index}" />
        </td>
        <td class="col-macro">
          <input type="text" inputmode="decimal" class="cell-input numeric" 
                 value="${row.carbs !== '' && row.carbs !== undefined ? row.carbs : ''}" data-field="carbs" data-index="${index}" />
        </td>
        <td class="col-cal">
          <input type="text" inputmode="numeric" class="cell-input numeric" style="font-weight: 800; color: #0F172A;" 
                 value="${row.calories !== '' && row.calories !== undefined ? row.calories : ''}" data-field="calories" data-index="${index}" 
                 ${state.autoCalcCalories ? 'readonly title="Auto-calculated from 4P + 4C + 9F"' : ''} />
        </td>
        <td class="col-action no-print">
          <div class="row-actions-group">
            <button type="button" class="row-action-btn" title="Move Up" data-action="move-up" data-index="${index}" ${index === 0 ? 'disabled style="opacity:0.3; cursor:default;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
            <button type="button" class="row-action-btn" title="Move Down" data-action="move-down" data-index="${index}" ${index === state.mealRows.length - 1 ? 'disabled style="opacity:0.3; cursor:default;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <button type="button" class="row-action-btn" title="Duplicate row" data-action="duplicate" data-index="${index}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button type="button" class="row-action-btn delete-btn" title="Delete row" data-action="delete" data-index="${index}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      `;

      els.tableBody.appendChild(tr);
    });
  }

  // Render Mobile Stacked Cards
  function renderMobileCards() {
    if (!els.mobileCardsContainer) return;
    els.mobileCardsContainer.innerHTML = '';

    state.mealRows.forEach((row, index) => {
      const card = document.createElement('div');
      card.className = 'meal-card';
      card.dataset.index = index;

      card.innerHTML = `
        <div class="meal-card-header">
          <div class="meal-card-sno-badge">#${index + 1}</div>
          <div class="meal-card-timing-inputs" style="display:flex; gap:6px; flex:1; margin:0 8px;">
            <input type="text" list="mealTimingOptions" class="cell-input" style="border:1px solid #CBD5E1; min-height:34px; padding:3px 6px; font-weight:600;" 
                   value="${escapeHtml(row.timing || '')}" placeholder="Meal Timing" data-field="timing" data-index="${index}" />
            <input type="text" class="cell-input" style="border:1px solid #CBD5E1; min-height:34px; width:78px; padding:3px 6px; text-align:center; font-family:var(--font-display); font-weight:700;" 
                   value="${escapeHtml(row.time || '')}" placeholder="Time" data-field="time" data-index="${index}" />
          </div>
          <div style="display:flex; gap:3px;">
            <button type="button" class="row-action-btn" title="Move Up" data-action="move-up" data-index="${index}" ${index === 0 ? 'disabled style="opacity:0.3; cursor:default;"' : ''}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
            </button>
            <button type="button" class="row-action-btn" title="Move Down" data-action="move-down" data-index="${index}" ${index === state.mealRows.length - 1 ? 'disabled style="opacity:0.3; cursor:default;"' : ''}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <button type="button" class="row-action-btn" title="Duplicate" data-action="duplicate" data-index="${index}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button type="button" class="row-action-btn delete-btn" title="Delete" data-action="delete" data-index="${index}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <div style="margin: 6px 0;">
          <input type="text" list="foodSuggestionsDatalist" class="cell-input" style="border:1px solid #CBD5E1; margin-bottom:4px; font-weight:700;" 
                 placeholder="Food item name..." value="${escapeHtml(row.itemName || '')}" data-field="itemName" data-index="${index}" />
          <input type="text" class="cell-input" style="border:1px solid #CBD5E1;" 
                 placeholder="Quantity: e.g. 100g + 1 pc" value="${escapeHtml(row.quantity || '')}" data-field="quantity" data-index="${index}" />
        </div>

        <div class="meal-card-macros-grid">
          <div>
            <span class="macro-mini-label">Protein (g)</span>
            <input type="text" inputmode="decimal" class="macro-mini-input" 
                   value="${row.protein !== '' && row.protein !== undefined ? row.protein : ''}" data-field="protein" data-index="${index}" />
          </div>
          <div>
            <span class="macro-mini-label">Fats (g)</span>
            <input type="text" inputmode="decimal" class="macro-mini-input" 
                   value="${row.fats !== '' && row.fats !== undefined ? row.fats : ''}" data-field="fats" data-index="${index}" />
          </div>
          <div>
            <span class="macro-mini-label">Carbs (g)</span>
            <input type="text" inputmode="decimal" class="macro-mini-input" 
                   value="${row.carbs !== '' && row.carbs !== undefined ? row.carbs : ''}" data-field="carbs" data-index="${index}" />
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
          <div style="font-weight:800; font-family:var(--font-display); font-size:1.1rem; color:var(--royal-blue);">
            Calories: ${row.calories !== '' && row.calories !== undefined ? row.calories : '0'}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted);">
            Row ${index + 1} of ${state.mealRows.length}
          </div>
        </div>
      `;

      els.mobileCardsContainer.appendChild(card);
    });
  }

  // -------------------------------------------------------------------------
  // MACRO & CALORIE CALCULATIONS
  // -------------------------------------------------------------------------
  function calculateAndRenderTotals() {
    let totProtein = 0;
    let totFats = 0;
    let totCarbs = 0;
    let totCalories = 0;

    state.mealRows.forEach((row, idx) => {
      const p = parseFloat(row.protein) || 0;
      const f = parseFloat(row.fats) || 0;
      const c = parseFloat(row.carbs) || 0;

      if (state.autoCalcCalories) {
        if (row.protein !== '' || row.fats !== '' || row.carbs !== '') {
          row.calories = Math.round((p * 4) + (c * 4) + (f * 9));
        } else {
          row.calories = '';
        }
        if (els.tableBody) {
          const calInput = els.tableBody.querySelector(`input[data-field="calories"][data-index="${idx}"]`);
          if (calInput && calInput.value != row.calories) {
            calInput.value = row.calories;
          }
        }
      }

      totProtein += p;
      totFats += f;
      totCarbs += c;
      totCalories += (parseFloat(row.calories) || 0);
    });

    const pStr = totProtein % 1 === 0 ? totProtein.toString() : totProtein.toFixed(1);
    const fStr = totFats % 1 === 0 ? totFats.toString() : totFats.toFixed(1);
    const cStr = totCarbs % 1 === 0 ? totCarbs.toString() : totCarbs.toFixed(1);
    const calStr = Math.round(totCalories).toString();

    // Plain numbers (no units) in totals
    if (els.totalProtein) els.totalProtein.textContent = pStr;
    if (els.totalFats) els.totalFats.textContent = fStr;
    if (els.totalCarbs) els.totalCarbs.textContent = cStr;
    if (els.totalCalories) els.totalCalories.textContent = calStr;

    // Render D3 Macronutrient Breakdown Visual Representation
    renderMacroBreakdown(totProtein, totFats, totCarbs, totCalories);
  }

  // -------------------------------------------------------------------------
  // D3 MACRONUTRIENT BREAKDOWN VISUALIZATION
  // -------------------------------------------------------------------------
  let d3TooltipEl = null;

  function getOrCreateD3Tooltip() {
    if (!d3TooltipEl) {
      d3TooltipEl = document.createElement('div');
      d3TooltipEl.className = 'd3-macro-tooltip';
      document.body.appendChild(d3TooltipEl);
    }
    return d3TooltipEl;
  }

  function renderMacroBreakdown(totProtein, totFats, totCarbs, totCalories) {
    if (!els.macroBreakdownRow) return;

    const d3 = window.d3;
    if (!d3) {
      // If D3 is loading via CDN, retry on next frame
      requestAnimationFrame(() => renderMacroBreakdown(totProtein, totFats, totCarbs, totCalories));
      return;
    }

    const p = Math.max(0, parseFloat(totProtein) || 0);
    const f = Math.max(0, parseFloat(totFats) || 0);
    const c = Math.max(0, parseFloat(totCarbs) || 0);

    const pCals = Math.round(p * 4);
    const fCals = Math.round(f * 9);
    const cCals = Math.round(c * 4);
    const totalGrams = p + f + c;
    const totalMacroCals = pCals + fCals + cCals;
    const displayCalories = Math.round(parseFloat(totCalories) || totalMacroCals);

    // Calculate percentage splits
    const pPctGrams = totalGrams > 0 ? (p / totalGrams) * 100 : 0;
    const fPctGrams = totalGrams > 0 ? (f / totalGrams) * 100 : 0;
    const cPctGrams = totalGrams > 0 ? (c / totalGrams) * 100 : 0;

    const pPctCals = totalMacroCals > 0 ? (pCals / totalMacroCals) * 100 : 0;
    const fPctCals = totalMacroCals > 0 ? (fCals / totalMacroCals) * 100 : 0;
    const cPctCals = totalMacroCals > 0 ? (cCals / totalMacroCals) * 100 : 0;

    const isCalMode = state.macroSplitMode === 'calories';
    const pPct = isCalMode ? pPctCals : pPctGrams;
    const fPct = isCalMode ? fPctCals : fPctGrams;
    const cPct = isCalMode ? cPctCals : cPctGrams;

    // Update text badge summary
    if (els.macroTotalMassBadge) {
      const gStr = totalGrams % 1 === 0 ? totalGrams.toString() : totalGrams.toFixed(1);
      els.macroTotalMassBadge.textContent = `${gStr}g Total • ${displayCalories} kcal`;
    }

    // Update card values
    if (els.proteinPctVal) els.proteinPctVal.textContent = `${pPct.toFixed(1)}%`;
    if (els.proteinGramsVal) els.proteinGramsVal.textContent = `${p % 1 === 0 ? p : p.toFixed(1)}g`;
    if (els.proteinCalsVal) els.proteinCalsVal.textContent = `${pCals} kcal`;

    if (els.fatsPctVal) els.fatsPctVal.textContent = `${fPct.toFixed(1)}%`;
    if (els.fatsGramsVal) els.fatsGramsVal.textContent = `${f % 1 === 0 ? f : f.toFixed(1)}g`;
    if (els.fatsCalsVal) els.fatsCalsVal.textContent = `${fCals} kcal`;

    if (els.carbsPctVal) els.carbsPctVal.textContent = `${cPct.toFixed(1)}%`;
    if (els.carbsGramsVal) els.carbsGramsVal.textContent = `${c % 1 === 0 ? c : c.toFixed(1)}g`;
    if (els.carbsCalsVal) els.carbsCalsVal.textContent = `${cCals} kcal`;

    // Tooltip helper
    const tooltip = getOrCreateD3Tooltip();

    // 1. D3 DONUT CHART
    if (els.d3MacroDonutChart) {
      d3.select(els.d3MacroDonutChart).selectAll('*').remove();

      const width = 104;
      const height = 104;
      const radius = 50;
      const innerRadius = 32;

      const svg = d3.select(els.d3MacroDonutChart)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('display', 'block');

      // Gradients definition
      const defs = svg.append('defs');

      const createGrad = (id, c1, c2) => {
        const grad = defs.append('linearGradient')
          .attr('id', id)
          .attr('x1', '0%').attr('y1', '0%')
          .attr('x2', '100%').attr('y2', '100%');
        grad.append('stop').attr('offset', '0%').attr('stop-color', c1);
        grad.append('stop').attr('offset', '100%').attr('stop-color', c2);
      };

      createGrad('d3-grad-protein', '#34D399', '#059669');
      createGrad('d3-grad-fats', '#FBBF24', '#D97706');
      createGrad('d3-grad-carbs', '#38BDF8', '#0284C7');

      const g = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      if (totalGrams === 0) {
        // Empty state ring
        const emptyArc = d3.arc().innerRadius(innerRadius).outerRadius(radius);
        g.append('path')
          .attr('d', emptyArc({ startAngle: 0, endAngle: 2 * Math.PI }))
          .attr('fill', '#E2E8F0');

        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 4)
          .attr('font-family', 'var(--font-display)')
          .attr('font-size', '11')
          .attr('font-weight', '700')
          .attr('fill', '#94A3B8')
          .text('NO DATA');
      } else {
        const macroSlices = [
          { key: 'protein', name: 'Protein', value: pPct, grams: p, cals: pCals, color: '#10B981', grad: 'url(#d3-grad-protein)', cardId: 'macroCardProtein' },
          { key: 'fats', name: 'Fats', value: fPct, grams: f, cals: fCals, color: '#F59E0B', grad: 'url(#d3-grad-fats)', cardId: 'macroCardFats' },
          { key: 'carbs', name: 'Carbs', value: cPct, grams: c, cals: cCals, color: '#0284C7', grad: 'url(#d3-grad-carbs)', cardId: 'macroCardCarbs' }
        ];

        const pie = d3.pie()
          .value(d => d.value)
          .sort(null)
          .padAngle(0.025);

        const arc = d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(radius)
          .cornerRadius(3);

        const arcHover = d3.arc()
          .innerRadius(innerRadius - 1)
          .outerRadius(radius + 2)
          .cornerRadius(3);

        const arcs = g.selectAll('.arc-slice')
          .data(pie(macroSlices))
          .enter()
          .append('g')
          .attr('class', 'arc-slice');

        arcs.append('path')
          .attr('d', arc)
          .attr('fill', d => d.data.grad)
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 1.5)
          .style('cursor', 'pointer')
          .on('mouseover', function(event, d) {
            d3.select(this)
              .transition().duration(120)
              .attr('d', arcHover)
              .attr('stroke-width', 2);

            const card = document.getElementById(d.data.cardId);
            if (card) card.style.transform = 'translateY(-2px) scale(1.02)';

            tooltip.innerHTML = `
              <div style="font-weight: 800; font-family: var(--font-display); color: #93C5FD; font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">
                ${d.data.name} • ${d.data.value.toFixed(1)}%
              </div>
              <div style="margin-top: 2px;">
                ${d.data.grams}g · ${d.data.cals} kcal (${isCalMode ? 'Calorie' : 'Gram'} Split)
              </div>
            `;
            tooltip.classList.add('visible');
          })
          .on('mousemove', function(event) {
            tooltip.style.left = `${event.clientX + 12}px`;
            tooltip.style.top = `${event.clientY + 12}px`;
          })
          .on('mouseout', function(event, d) {
            d3.select(this)
              .transition().duration(120)
              .attr('d', arc)
              .attr('stroke-width', 1.5);

            const card = document.getElementById(d.data.cardId);
            if (card) card.style.transform = '';

            tooltip.classList.remove('visible');
          });

        // Center labels
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', -3)
          .attr('font-family', 'var(--font-display)')
          .attr('font-size', '9')
          .attr('font-weight', '700')
          .attr('fill', '#64748B')
          .attr('letter-spacing', '0.06em')
          .text(isCalMode ? 'CAL SPLIT' : 'MACRO SPLIT');

        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 13)
          .attr('font-family', 'var(--font-display)')
          .attr('font-size', '13')
          .attr('font-weight', '900')
          .attr('fill', '#0B1F3A')
          .text('100%');
      }
    }

    // 2. D3 STACKED HORIZONTAL BAR
    if (els.d3MacroBarChart) {
      d3.select(els.d3MacroBarChart).selectAll('*').remove();

      const barWidth = 600;
      const barHeight = 22;

      const svg = d3.select(els.d3MacroBarChart)
        .append('svg')
        .attr('width', '100%')
        .attr('height', barHeight)
        .attr('viewBox', `0 0 ${barWidth} ${barHeight}`)
        .attr('preserveAspectRatio', 'none')
        .style('display', 'block');

      const clipId = 'd3-macro-bar-clip-' + Math.random().toString(36).substring(2, 7);
      svg.append('clipPath')
        .attr('id', clipId)
        .append('rect')
        .attr('width', barWidth)
        .attr('height', barHeight)
        .attr('rx', 6)
        .attr('ry', 6);

      const barG = svg.append('g').attr('clip-path', `url(#${clipId})`);

      if (totalGrams === 0) {
        barG.append('rect')
          .attr('width', barWidth)
          .attr('height', barHeight)
          .attr('fill', '#F1F5F9');
      } else {
        const wP = (pPct / 100) * barWidth;
        const wF = (fPct / 100) * barWidth;
        const wC = (cPct / 100) * barWidth;

        const segments = [
          { name: 'Protein', key: 'P', pct: pPct, grams: p, cals: pCals, x: 0, width: wP, color: '#10B981', cardId: 'macroCardProtein' },
          { name: 'Fats', key: 'F', pct: fPct, grams: f, cals: fCals, x: wP, width: wF, color: '#F59E0B', cardId: 'macroCardFats' },
          { name: 'Carbs', key: 'C', pct: cPct, grams: c, cals: cCals, x: wP + wF, width: wC, color: '#0284C7', cardId: 'macroCardCarbs' }
        ];

        segments.forEach(seg => {
          if (seg.width <= 0) return;

          const segG = barG.append('g')
            .style('cursor', 'pointer')
            .on('mouseover', function() {
              d3.select(this).select('rect').attr('opacity', '0.85');
              const card = document.getElementById(seg.cardId);
              if (card) card.style.transform = 'translateY(-2px) scale(1.02)';

              tooltip.innerHTML = `
                <div style="font-weight: 800; font-family: var(--font-display); color: #93C5FD; font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">
                  ${seg.name} • ${seg.pct.toFixed(1)}%
                </div>
                <div style="margin-top: 2px;">
                  ${seg.grams}g · ${seg.cals} kcal (${isCalMode ? 'Calorie' : 'Gram'} Split)
                </div>
              `;
              tooltip.classList.add('visible');
            })
            .on('mousemove', function(event) {
              tooltip.style.left = `${event.clientX + 12}px`;
              tooltip.style.top = `${event.clientY + 12}px`;
            })
            .on('mouseout', function() {
              d3.select(this).select('rect').attr('opacity', '1');
              const card = document.getElementById(seg.cardId);
              if (card) card.style.transform = '';
              tooltip.classList.remove('visible');
            });

          segG.append('rect')
            .attr('x', seg.x)
            .attr('y', 0)
            .attr('width', seg.width)
            .attr('height', barHeight)
            .attr('fill', seg.color)
            .attr('stroke', '#FFFFFF')
            .attr('stroke-width', 1.5);

          if (seg.width >= 46) {
            segG.append('text')
              .attr('x', seg.x + seg.width / 2)
              .attr('y', 15)
              .attr('text-anchor', 'middle')
              .attr('fill', '#FFFFFF')
              .attr('font-family', 'var(--font-display)')
              .attr('font-size', '11.5')
              .attr('font-weight', '800')
              .attr('letter-spacing', '0.04em')
              .text(`${seg.key}: ${seg.pct.toFixed(0)}%`);
          }
        });
      }
    }

    // 3. SYNC TO MOBILE CONTAINER
    syncMobileMacroBreakdown();
  }

  function syncMobileMacroBreakdown() {
    if (!els.mobileMacroBreakdownContainer || !els.macroBreakdownContainer) return;

    // Clone container content for mobile stacked card view
    const clone = els.macroBreakdownContainer.cloneNode(true);
    clone.id = 'mobileMacroBreakdownClone';

    const subDonut = clone.querySelector('#d3MacroDonutChart');
    if (subDonut) subDonut.id = 'mobileD3MacroDonutChart';
    const subBar = clone.querySelector('#d3MacroBarChart');
    if (subBar) subBar.id = 'mobileD3MacroBarChart';

    // Hook toggle buttons on mobile clone
    const mobileBtnGrams = clone.querySelector('#btnSplitGrams');
    const mobileBtnCals = clone.querySelector('#btnSplitCalories');
    if (mobileBtnGrams && mobileBtnCals) {
      mobileBtnGrams.id = 'mobileBtnSplitGrams';
      mobileBtnCals.id = 'mobileBtnSplitCalories';
      mobileBtnGrams.addEventListener('click', () => {
        state.macroSplitMode = 'grams';
        updateMacroToggleButtons();
        calculateAndRenderTotals();
        saveStateToStorage();
      });
      mobileBtnCals.addEventListener('click', () => {
        state.macroSplitMode = 'calories';
        updateMacroToggleButtons();
        calculateAndRenderTotals();
        saveStateToStorage();
      });
    }

    els.mobileMacroBreakdownContainer.innerHTML = '';
    els.mobileMacroBreakdownContainer.appendChild(clone);
  }

  function updateMacroToggleButtons() {
    const isCalMode = state.macroSplitMode === 'calories';
    if (els.btnSplitGrams) els.btnSplitGrams.classList.toggle('active', !isCalMode);
    if (els.btnSplitCalories) els.btnSplitCalories.classList.toggle('active', isCalMode);
    const mGrams = document.getElementById('mobileBtnSplitGrams');
    const mCals = document.getElementById('mobileBtnSplitCalories');
    if (mGrams) mGrams.classList.toggle('active', !isCalMode);
    if (mCals) mCals.classList.toggle('active', isCalMode);
  }

  // -------------------------------------------------------------------------
  // ROW ACTIONS (ADD, DUPLICATE, DELETE, REORDER)
  // -------------------------------------------------------------------------
  function addNewMealRow() {
    const nextTiming = MEAL_TIMINGS[state.mealRows.length % MEAL_TIMINGS.length] || '';
    const newRow = {
      timing: nextTiming,
      time: '',
      itemName: '',
      quantity: '',
      protein: '',
      fats: '',
      carbs: '',
      calories: ''
    };
    state.mealRows.push(newRow);
    renderDietTableRows();
    renderMobileCards();
    calculateAndRenderTotals();
    saveStateToStorage();
    showToast('New meal row added', 'info');

    setTimeout(() => {
      const inputs = document.querySelectorAll(`[data-field="itemName"][data-index="${state.mealRows.length - 1}"]`);
      if (inputs.length) inputs[0].focus();
    }, 50);
  }

  function duplicateRow(index) {
    if (index < 0 || index >= state.mealRows.length) return;
    const cloned = JSON.parse(JSON.stringify(state.mealRows[index]));
    state.mealRows.splice(index + 1, 0, cloned);
    renderDietTableRows();
    renderMobileCards();
    calculateAndRenderTotals();
    saveStateToStorage();
    showToast(`Row ${index + 1} duplicated`, 'info');
  }

  function deleteRow(index) {
    if (state.mealRows.length <= 1) {
      showToast('At least one meal row is required', 'error');
      return;
    }
    state.mealRows.splice(index, 1);
    renderDietTableRows();
    renderMobileCards();
    calculateAndRenderTotals();
    saveStateToStorage();
    showToast('Meal row removed', 'info');
  }

  function moveRowUp(index) {
    if (index <= 0 || index >= state.mealRows.length) return;
    const temp = state.mealRows[index];
    state.mealRows[index] = state.mealRows[index - 1];
    state.mealRows[index - 1] = temp;
    renderDietTableRows();
    renderMobileCards();
    calculateAndRenderTotals();
    saveStateToStorage();
  }

  function moveRowDown(index) {
    if (index < 0 || index >= state.mealRows.length - 1) return;
    const temp = state.mealRows[index];
    state.mealRows[index] = state.mealRows[index + 1];
    state.mealRows[index + 1] = temp;
    renderDietTableRows();
    renderMobileCards();
    calculateAndRenderTotals();
    saveStateToStorage();
  }

  // -------------------------------------------------------------------------
  // AUTOCOMPLETE AUTO-FILL HANDLER
  // -------------------------------------------------------------------------
  function checkAndAutoFillFood(val, rowIndex) {
    if (!val || typeof val !== 'string') return;
    const cleanVal = val.trim().toLowerCase();
    if (!cleanVal) return;

    const matched = INDIAN_FOODS_DB.find(f => f.name.toLowerCase() === cleanVal || f.name.toLowerCase().startsWith(cleanVal));
    if (matched) {
      const row = state.mealRows[rowIndex];
      if (row) {
        row.itemName = matched.name;
        row.quantity = matched.qty;
        row.protein = matched.p;
        row.fats = matched.f;
        row.carbs = matched.c;
        row.calories = matched.cal;

        renderDietTableRows();
        renderMobileCards();
        calculateAndRenderTotals();
        saveStateToStorage();
        showToast(`Auto-filled values for ${matched.name}`, 'success');
      }
    }
  }

  // -------------------------------------------------------------------------
  // EVENT LISTENERS SETUP
  // -------------------------------------------------------------------------
  function attachEventListeners() {
    // Client Info Fields
    const clientFields = [
      { el: els.clientName, key: 'name' },
      { el: els.trainerName, key: 'trainer' },
      { el: els.chartDate, key: 'date' },
      { el: els.clientGoal, key: 'goal' }
    ];

    clientFields.forEach(({ el, key }) => {
      if (!el) return;
      el.addEventListener('input', () => {
        state.client[key] = el.value;
        saveStateToStorage();
      });
    });

    // Instructions
    if (els.instructionsTextarea) {
      els.instructionsTextarea.addEventListener('input', () => {
        state.instructionsText = els.instructionsTextarea.value;
        saveStateToStorage();
      });
    }

    // Auto Calc Calories Toggle
    if (els.autoCalcToggle) {
      els.autoCalcToggle.addEventListener('change', () => {
        state.autoCalcCalories = els.autoCalcToggle.checked;
        renderDietTableRows();
        calculateAndRenderTotals();
        saveStateToStorage();
        showToast(state.autoCalcCalories ? 'Auto-Calc Calories enabled (4P + 4C + 9F)' : 'Manual Calories entry enabled', 'info');
      });
    }

    // Add Row Buttons
    if (els.btnAddMealRow) els.btnAddMealRow.addEventListener('click', addNewMealRow);
    if (els.btnAddMealRowMobile) els.btnAddMealRowMobile.addEventListener('click', addNewMealRow);

    // Table & Card Input Delegate
    const handleCellInput = (e) => {
      const target = e.target;
      const field = target.dataset.field;
      const index = parseInt(target.dataset.index, 10);

      if (field && !isNaN(index) && state.mealRows[index]) {
        state.mealRows[index][field] = target.value;
        calculateAndRenderTotals();
        saveStateToStorage();
      }
    };

    const handleCellChange = (e) => {
      const target = e.target;
      const field = target.dataset.field;
      const index = parseInt(target.dataset.index, 10);
      if (field === 'itemName' && !isNaN(index)) {
        checkAndAutoFillFood(target.value, index);
      }
    };

    const handleActionClick = (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const index = parseInt(btn.dataset.index, 10);

      if (action === 'delete') {
        deleteRow(index);
      } else if (action === 'duplicate') {
        duplicateRow(index);
      } else if (action === 'move-up') {
        moveRowUp(index);
      } else if (action === 'move-down') {
        moveRowDown(index);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const index = parseInt(e.target.dataset.index, 10);
        if (index === state.mealRows.length - 1 && e.target.dataset.field === 'calories') {
          e.preventDefault();
          addNewMealRow();
        }
      }
    };

    if (els.tableBody) {
      els.tableBody.addEventListener('input', handleCellInput);
      els.tableBody.addEventListener('change', handleCellChange);
      els.tableBody.addEventListener('click', handleActionClick);
      els.tableBody.addEventListener('keydown', handleKeyDown);
    }

    if (els.mobileCardsContainer) {
      els.mobileCardsContainer.addEventListener('input', handleCellInput);
      els.mobileCardsContainer.addEventListener('change', handleCellChange);
      els.mobileCardsContainer.addEventListener('click', handleActionClick);
    }

    // Toolbar Actions
    const handlePrint = () => window.print();
    if (els.btnPrintChart) els.btnPrintChart.addEventListener('click', handlePrint);
    if (els.mBtnPrint) els.mBtnPrint.addEventListener('click', handlePrint);

    const handlePDF = () => generateAndExportPDF();
    if (els.btnSavePDF) els.btnSavePDF.addEventListener('click', handlePDF);
    if (els.mBtnPDF) els.mBtnPDF.addEventListener('click', handlePDF);

    const handleExcel = () => exportToExcel();
    if (els.btnExportExcel) els.btnExportExcel.addEventListener('click', handleExcel);
    if (els.mBtnExcel) els.mBtnExcel.addEventListener('click', handleExcel);

    // Macro Split Toggle (Grams vs Calories)
    if (els.btnSplitGrams) {
      els.btnSplitGrams.addEventListener('click', () => {
        state.macroSplitMode = 'grams';
        updateMacroToggleButtons();
        calculateAndRenderTotals();
        saveStateToStorage();
      });
    }
    if (els.btnSplitCalories) {
      els.btnSplitCalories.addEventListener('click', () => {
        state.macroSplitMode = 'calories';
        updateMacroToggleButtons();
        calculateAndRenderTotals();
        saveStateToStorage();
      });
    }

    // Reset Table Modal
    const openResetModal = () => {
      if (els.resetModal) els.resetModal.classList.add('active');
    };
    const closeResetModal = () => {
      if (els.resetModal) els.resetModal.classList.remove('active');
    };

    if (els.btnResetTable) els.btnResetTable.addEventListener('click', openResetModal);
    if (els.mBtnReset) els.mBtnReset.addEventListener('click', openResetModal);
    if (els.resetModalCancel) els.resetModalCancel.addEventListener('click', closeResetModal);
    if (els.resetModalConfirm) {
      els.resetModalConfirm.addEventListener('click', () => {
        state.mealRows = JSON.parse(JSON.stringify(DEFAULT_MEAL_ROWS));
        renderDietTableRows();
        renderMobileCards();
        calculateAndRenderTotals();
        saveStateToStorage();
        closeResetModal();
        showToast('Table reset to default 9 rows', 'success');
      });
    }

    // New Client Action
    const handleNewClient = () => {
      state.client = {
        name: 'Client Name',
        trainer: state.gym.trainerName,
        date: getTodayFormatted(),
        goal: 'e.g. Weight Loss / Muscle Gain'
      };
      state.mealRows = JSON.parse(JSON.stringify(DEFAULT_MEAL_ROWS));
      renderClientFields();
      renderDietTableRows();
      renderMobileCards();
      calculateAndRenderTotals();
      saveStateToStorage();
      showToast('New client profile initialized', 'info');
      if (els.clientName) els.clientName.focus();
    };

    if (els.btnNewClient) els.btnNewClient.addEventListener('click', handleNewClient);
    if (els.mBtnNewClient) els.mBtnNewClient.addEventListener('click', handleNewClient);

    // Gym Profile Modal
    if (els.btnEditGym) {
      els.btnEditGym.addEventListener('click', openGymModal);
    }
    if (els.gymModalClose) els.gymModalClose.addEventListener('click', closeGymModal);
    if (els.gymModalCancel) els.gymModalCancel.addEventListener('click', closeGymModal);
    if (els.gymModalSave) els.gymModalSave.addEventListener('click', saveGymModal);

    // Logo Upload & Folder Reload
    if (els.gymLogoFileInput) {
      els.gymLogoFileInput.addEventListener('change', handleLogoFileUpload);
    }
    if (els.btnReloadFolderLogo) {
      els.btnReloadFolderLogo.addEventListener('click', () => {
        initLogoImage(true);
      });
    }
    if (els.btnResetDefaultLogo) {
      els.btnResetDefaultLogo.addEventListener('click', () => {
        state.gym.logoDataUri = './logo.png';
        renderGymHeader();
        saveStateToStorage();
        initLogoImage(false);
        showToast('Reset to default Shape Squad logo', 'info');
      });
    }
  }

  // -------------------------------------------------------------------------
  // GYM PROFILE MODAL HANDLERS
  // -------------------------------------------------------------------------
  function openGymModal() {
    if (!els.gymModal) return;
    if (els.gymInputName) els.gymInputName.value = state.gym.name;
    if (els.gymInputTagline) els.gymInputTagline.value = state.gym.tagline;
    if (els.gymInputAddress) els.gymInputAddress.value = state.gym.address;
    if (els.gymInputPhone) els.gymInputPhone.value = state.gym.phone;
    if (els.gymInputEmail) els.gymInputEmail.value = state.gym.email;
    if (els.gymInputTrainer) els.gymInputTrainer.value = state.gym.trainerName;
    els.gymModal.classList.add('active');
  }

  function closeGymModal() {
    if (els.gymModal) els.gymModal.classList.remove('active');
  }

  function saveGymModal() {
    if (els.gymInputName) state.gym.name = els.gymInputName.value.trim() || DEFAULT_GYM_PROFILE.name;
    if (els.gymInputTagline) state.gym.tagline = els.gymInputTagline.value.trim() || DEFAULT_GYM_PROFILE.tagline;
    if (els.gymInputAddress) state.gym.address = els.gymInputAddress.value.trim() || DEFAULT_GYM_PROFILE.address;
    if (els.gymInputPhone) state.gym.phone = els.gymInputPhone.value.trim() || DEFAULT_GYM_PROFILE.phone;
    if (els.gymInputEmail) state.gym.email = els.gymInputEmail.value.trim() || DEFAULT_GYM_PROFILE.email;
    if (els.gymInputTrainer) state.gym.trainerName = els.gymInputTrainer.value.trim() || DEFAULT_GYM_PROFILE.trainerName;

    renderGymHeader();
    saveStateToStorage();
    closeGymModal();
    showToast('Gym profile and contact details updated', 'success');
  }

  function handleLogoFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, SVG)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (evt) {
      state.gym.logoDataUri = evt.target.result;
      renderGymHeader();
      saveStateToStorage();
      showToast('Custom gym logo uploaded (circular cropped)', 'success');
    };
    reader.readAsDataURL(file);
  }

  // -------------------------------------------------------------------------
  // TOAST SYSTEM
  // -------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    if (!els.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg} <span>${escapeHtml(message)}</span>`;
    els.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // -------------------------------------------------------------------------
  // PIXEL-PERFECT A4 LANDSCAPE PDF EXPORT ENGINE
  // Strict Row Protection: Page breaks ONLY occur between 2 rows!
  // No row is ever cut in half.
  // -------------------------------------------------------------------------
  async function generateAndExportPDF() {
    showToast('Generating high-resolution A4 Landscape PDF…', 'info');

    if (typeof window.html2canvas !== 'function' || !window.jspdf) {
      showToast('PDF rendering library is initializing, please retry...', 'error');
      return;
    }

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Build Off-screen Stage
      let stage = document.getElementById('pdf-export-stage');
      if (!stage) {
        stage = document.createElement('div');
        stage.id = 'pdf-export-stage';
        document.body.appendChild(stage);
      }
      stage.innerHTML = '';

      // Calculate totals once
      let totP = 0, totF = 0, totC = 0, totCal = 0;
      state.mealRows.forEach(r => {
        totP += (parseFloat(r.protein) || 0);
        totF += (parseFloat(r.fats) || 0);
        totC += (parseFloat(r.carbs) || 0);
        totCal += (parseFloat(r.calories) || 0);
      });
      const pStr = totP % 1 === 0 ? totP.toString() : totP.toFixed(1);
      const fStr = totF % 1 === 0 ? totF.toString() : totF.toFixed(1);
      const cStr = totC % 1 === 0 ? totC.toString() : totC.toFixed(1);
      const calStr = Math.round(totCal).toString();

      // Row HTML generator helper
      const renderRowHtml = (row, idx) => {
        const bg = (idx % 2 === 1) ? 'background-color: #F4F8FF;' : 'background-color: #FFFFFF;';
        return `
          <tr style="${bg}">
            <td style="width: 4.5%; text-align: center; padding: 6.5px 4px; font-family: var(--font-display); font-weight: 800; font-size: 1.15rem; color: #1D4ED8; border-bottom: 1px solid #D3E2FA; border-right: 1px solid #D3E2FA;">
              ${idx + 1}
            </td>
            <td style="width: 13%; padding: 6.5px 8px; font-weight: 600; font-size: 0.88rem; color: #0F172A; border-bottom: 1px solid #D3E2FA; border-right: 1px solid #D3E2FA;">
              ${escapeHtml(row.timing || '')}
            </td>
            <td style="width: 8.5%; text-align: center; padding: 6.5px 4px; font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; color: #0F172A; border-bottom: 1px solid #D3E2FA; border-right: 1px solid #D3E2FA;">
              ${escapeHtml(row.time || '')}
            </td>
            <td style="width: 28%; padding: 6.5px 10px; font-weight: 700; font-size: 0.88rem; color: #0F172A; line-height: 1.32; border-bottom: 1px solid #D3E2FA; border-right: 1px solid #D3E2FA; word-break: break-word;">
              ${escapeHtml(row.itemName || '')}
            </td>
            <td style="width: 13.5%; padding: 6.5px 8px; font-size: 0.85rem; color: #334155; font-weight: 600; border-bottom: 1px solid #D3E2FA; border-right: 1px solid #D3E2FA; word-break: break-word;">
              ${escapeHtml(row.quantity || '')}
            </td>
            <td style="width: 7.5%; text-align: center; padding: 6.5px 4px; font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: #0F172A; border-bottom: 1px solid #D3E2FA; border-right: 1px solid #D3E2FA;">
              ${row.protein !== '' && row.protein !== undefined ? row.protein : ''}
            </td>
            <td style="width: 7.5%; text-align: center; padding: 6.5px 4px; font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: #0F172A; border-bottom: 1px solid #D3E2FA; border-right: 1px solid #D3E2FA;">
              ${row.fats !== '' && row.fats !== undefined ? row.fats : ''}
            </td>
            <td style="width: 7.5%; text-align: center; padding: 6.5px 4px; font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: #0F172A; border-bottom: 1px solid #D3E2FA; border-right: 1px solid #D3E2FA;">
              ${row.carbs !== '' && row.carbs !== undefined ? row.carbs : ''}
            </td>
            <td style="width: 10%; text-align: center; padding: 6.5px 4px; font-family: var(--font-display); font-weight: 800; font-size: 1.15rem; color: #0F172A; border-bottom: 1px solid #D3E2FA;">
              ${row.calories !== '' && row.calories !== undefined ? row.calories : ''}
            </td>
          </tr>
        `;
      };

      const tableHeadHtml = `
        <thead>
          <tr>
            <th rowspan="2" style="width: 4.5%; background: linear-gradient(180deg, #07152B 0%, #0B1F3A 100%); color: #FFFFFF; font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; letter-spacing: 0.06em; padding: 7px 4px; text-align: center; border-bottom: 1.5px solid #1E3A8A; border-right: 1px solid rgba(255, 255, 255, 0.12);">
              S.No.
            </th>
            <th rowspan="2" style="width: 13%; background: linear-gradient(180deg, #07152B 0%, #0B1F3A 100%); color: #FFFFFF; font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; letter-spacing: 0.06em; padding: 7px 8px; text-align: left; border-bottom: 1.5px solid #1E3A8A; border-right: 1px solid rgba(255, 255, 255, 0.12);">
              MEAL TIMING
            </th>
            <th rowspan="2" style="width: 8.5%; background: linear-gradient(180deg, #07152B 0%, #0B1F3A 100%); color: #FFFFFF; font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; letter-spacing: 0.06em; padding: 7px 4px; text-align: center; border-bottom: 1.5px solid #1E3A8A; border-right: 1px solid rgba(255, 255, 255, 0.12);">
              TIME
            </th>
            <th rowspan="2" style="width: 28%; background: linear-gradient(180deg, #07152B 0%, #0B1F3A 100%); color: #FFFFFF; font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; letter-spacing: 0.06em; padding: 7px 10px; text-align: left; border-bottom: 1.5px solid #1E3A8A; border-right: 1px solid rgba(255, 255, 255, 0.12);">
              ITEM NAME
            </th>
            <th rowspan="2" style="width: 13.5%; background: linear-gradient(180deg, #07152B 0%, #0B1F3A 100%); color: #FFFFFF; font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; letter-spacing: 0.06em; padding: 7px 8px; text-align: left; border-bottom: 1.5px solid #1E3A8A; border-right: 1px solid rgba(255, 255, 255, 0.12);">
              QUANTITY
            </th>
            <th colspan="3" style="width: 22.5%; background: linear-gradient(180deg, #07152B 0%, #0B1F3A 100%); color: #FFFFFF; font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; letter-spacing: 0.06em; padding: 5px 4px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.2); border-right: 1px solid rgba(255, 255, 255, 0.12);">
              NUTRIENTS
            </th>
            <th rowspan="2" style="width: 10%; background: linear-gradient(180deg, #07152B 0%, #0B1F3A 100%); color: #FFFFFF; font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; letter-spacing: 0.06em; padding: 7px 4px; text-align: center; border-bottom: 1.5px solid #1E3A8A;">
              CALORIE COUNT
            </th>
          </tr>
          <tr>
            <th style="width: 7.5%; background: #102B52; color: #E2E8F0; font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; padding: 5px 4px; text-align: center; border-bottom: 1.5px solid #CBD5E1; border-right: 1px solid rgba(255, 255, 255, 0.1);">
              PROTEIN G
            </th>
            <th style="width: 7.5%; background: #102B52; color: #E2E8F0; font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; padding: 5px 4px; text-align: center; border-bottom: 1.5px solid #CBD5E1; border-right: 1px solid rgba(255, 255, 255, 0.1);">
              FATS G
            </th>
            <th style="width: 7.5%; background: #102B52; color: #E2E8F0; font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; padding: 5px 4px; text-align: center; border-bottom: 1.5px solid #CBD5E1; border-right: 1px solid rgba(255, 255, 255, 0.1);">
              CARBS G
            </th>
          </tr>
        </thead>
      `;

      // Header component with circular cropped logo
      const renderHeaderHtml = (isContinuation = false) => `
        <div style="background: linear-gradient(90deg, #07152B 0%, #0B254E 45%, #103B7B 100%); color: #FFFFFF; padding: 10px 24px; border-bottom: 2.5px solid #38BDF8; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: #07152B; border: 2.5px solid #FFFFFF; box-shadow: 0 0 10px rgba(56, 189, 248, 0.6); overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 0;">
              <img src="${state.gym.logoDataUri}" alt="${escapeHtml(state.gym.name)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />
            </div>
            <div>
              <div style="font-family: var(--font-display); font-size: 1.65rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: #FFFFFF; line-height: 1.05;">
                ${escapeHtml(state.gym.name)} ${isContinuation ? '<span style="font-size: 0.95rem; color:#93C5FD; font-weight:600; margin-left:8px;">(CONTD.)</span>' : ''}
              </div>
              <div style="font-family: var(--font-display); font-size: 0.82rem; font-weight: 600; letter-spacing: 0.18em; color: #93C5FD; text-transform: uppercase; margin-top: 2px;">
                ${escapeHtml(state.gym.tagline)}
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; font-size: 0.82rem; color: #E2E8F0; font-weight: 500;">
            <span>📍 ${escapeHtml(state.gym.address)}</span>
            <span style="color: rgba(255,255,255,0.35);">|</span>
            <span>📞 ${escapeHtml(state.gym.phone)}</span>
            <span style="color: rgba(255,255,255,0.35);">|</span>
            <span>✉ ${escapeHtml(state.gym.email)}</span>
          </div>
        </div>
      `;

      // Client info row
      const renderClientInfoHtml = () => `
        <div style="padding: 10px 24px 8px 24px; background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
            <div>
              <div style="font-family: var(--font-display); font-size: 0.8rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #1D4ED8; margin-bottom: 2px;">CLIENT NAME</div>
              <div style="font-family: var(--font-body); font-size: 0.95rem; font-weight: 600; color: #0F172A; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 3px;">
                ${escapeHtml(state.client.name || 'Client Name')}
              </div>
            </div>
            <div>
              <div style="font-family: var(--font-display); font-size: 0.8rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #1D4ED8; margin-bottom: 2px;">TRAINER NAME</div>
              <div style="font-family: var(--font-body); font-size: 0.95rem; font-weight: 600; color: #0F172A; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 3px;">
                ${escapeHtml(state.client.trainer || state.gym.trainerName)}
              </div>
            </div>
            <div>
              <div style="font-family: var(--font-display); font-size: 0.8rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #1D4ED8; margin-bottom: 2px;">DATE</div>
              <div style="font-family: var(--font-body); font-size: 0.95rem; font-weight: 600; color: #0F172A; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 3px;">
                ${escapeHtml(state.client.date || 'DD/MM/YYYY')}
              </div>
            </div>
            <div>
              <div style="font-family: var(--font-display); font-size: 0.8rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #1D4ED8; margin-bottom: 2px;">GOAL</div>
              <div style="font-family: var(--font-body); font-size: 0.95rem; font-weight: 600; color: #0F172A; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 3px;">
                ${escapeHtml(state.client.goal || 'e.g. Weight Loss / Muscle Gain')}
              </div>
            </div>
          </div>
        </div>
      `;

      // Title Banner
      const renderTitleHtml = () => `
        <div style="text-align: center; padding: 8px 20px 6px 20px; background: #FFFFFF;">
          <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 900; letter-spacing: 0.28em; color: #0B1F3A; text-transform: uppercase; line-height: 1;">
            DIET CHART
          </div>
          <div style="width: 58px; height: 3px; background: linear-gradient(90deg, #1D4ED8, #38BDF8); margin: 4px auto 0 auto; border-radius: 2px;"></div>
        </div>
      `;

      // Footer sections (Totals, Notes, Signatures, Banner)
      const renderFooterSectionsHtml = () => `
        <!-- Trainer's Notes / Instructions Box -->
        <div style="padding: 6px 24px 8px 24px; background: #FFFFFF;">
          <div style="border: 1.5px solid #93C5FD; border-radius: 6px; padding: 8px 14px; background: #EEF4FF;">
            <div style="font-family: var(--font-display); font-size: 0.92rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #1D4ED8; margin-bottom: 3px;">
              TRAINER'S NOTES / INSTRUCTIONS
            </div>
            <div style="font-family: var(--font-body); font-size: 0.85rem; color: #334155; line-height: 1.45; white-space: pre-wrap;">
              ${escapeHtml(state.instructionsText || 'e.g. Drink 3–4 litres of water daily. Avoid processed sugar. Take meals every 3 hours...')}
            </div>
          </div>
        </div>

        <!-- Symmetrical Signatures -->
        <div style="padding: 12px 48px 12px 48px; background: #FFFFFF; display: flex; align-items: flex-end; justify-content: space-between;">
          <div style="text-align: center; width: 220px;">
            <div style="border-bottom: 1.5px solid #94A3B8; width: 100%; margin-bottom: 6px;"></div>
            <div style="font-family: var(--font-display); font-size: 0.9rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #0B1F3A;">
              CLIENT SIGNATURE
            </div>
          </div>
          <div style="text-align: center; width: 220px;">
            <div style="border-bottom: 1.5px solid #94A3B8; width: 100%; margin-bottom: 6px;"></div>
            <div style="font-family: var(--font-display); font-size: 0.9rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #0B1F3A;">
              TRAINER SIGNATURE
            </div>
          </div>
        </div>

        <!-- Document Footer Banner -->
        <div style="background: #07152B; color: #FFFFFF; text-align: center; padding: 7px 16px; font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
          Shape Squad Fitness Centre • Consistency Builds Champions
        </div>
      `;

      // Circular Watermark
      const watermarkHtml = `
        <div style="position: absolute; top: 52%; left: 50%; transform: translate(-50%, -50%); width: 420px; height: 420px; opacity: 0.045; pointer-events: none; z-index: 0; display:flex; align-items:center; justify-content:center; border-radius:50%; overflow:hidden;">
          <img src="${state.gym.logoDataUri}" alt="Watermark" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;" />
        </div>
      `;

      // -----------------------------------------------------------------------
      // CHUNK ROWS BY PAGE SO PAGE BREAKS ONLY HAPPEN BETWEEN ROWS
      // -----------------------------------------------------------------------
      const totalRows = state.mealRows.length;
      let pages = [];

      if (totalRows <= 8) {
        // All rows fit cleanly onto 1 landscape A4 page with full footer sections & D3 breakdown!
        pages.push({
          isFirst: true,
          isLast: true,
          rows: state.mealRows.map((r, i) => ({ data: r, originalIndex: i }))
        });
      } else {
        // Multi-page document:
        // Reserve up to 5 rows on the final page along with Totals, D3 Breakdown & Signatures
        const rowsForLastPage = Math.min(totalRows - 1, 5);
        const earlierCount = totalRows - rowsForLastPage;

        // Split earlier rows into pages of max 12 rows
        const earlierChunks = Math.ceil(earlierCount / 12);
        const rowsPerEarlierChunk = Math.ceil(earlierCount / earlierChunks);

        let curIdx = 0;
        for (let p = 0; p < earlierChunks; p++) {
          const chunkEnd = Math.min(curIdx + rowsPerEarlierChunk, earlierCount);
          const chunkRows = [];
          for (let r = curIdx; r < chunkEnd; r++) {
            chunkRows.push({ data: state.mealRows[r], originalIndex: r });
          }
          curIdx = chunkEnd;
          pages.push({
            isFirst: (p === 0),
            isLast: false,
            rows: chunkRows
          });
        }

        // Final page
        const lastRows = [];
        for (let r = earlierCount; r < totalRows; r++) {
          lastRows.push({ data: state.mealRows[r], originalIndex: r });
        }
        pages.push({
          isFirst: false,
          isLast: true,
          rows: lastRows
        });
      }

      // Initialize jsPDF document (Landscape A4: 297mm x 210mm)
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 297;
      const pageHeight = 210;
      const margin = 6;
      const printWidth = pageWidth - (margin * 2);
      const printHeight = pageHeight - (margin * 2);

      // Render each page individually into DOM & PDF
      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const pageInfo = pages[pIdx];

        const pageEl = document.createElement('div');
        pageEl.className = 'chart-document';
        pageEl.style.width = '1122px';
        pageEl.style.minHeight = '785px';
        pageEl.style.maxHeight = '795px';
        pageEl.style.background = '#FFFFFF';
        pageEl.style.margin = '0 auto';
        pageEl.style.boxShadow = 'none';
        pageEl.style.border = 'none';
        pageEl.style.position = 'relative';
        pageEl.style.overflow = 'hidden';
        pageEl.style.display = 'flex';
        pageEl.style.flexDirection = 'column';
        pageEl.style.justifyContent = 'space-between';

        const rowsHtml = pageInfo.rows.map(r => renderRowHtml(r.data, r.originalIndex)).join('');

        let breakdownCloneHtml = '';
        const breakdownRowEl = document.getElementById('macroBreakdownRow');
        if (breakdownRowEl && pageInfo.isLast) {
          const tempTable = document.createElement('table');
          tempTable.innerHTML = breakdownRowEl.outerHTML;
          tempTable.querySelectorAll('.no-print').forEach(el => el.remove());
          breakdownCloneHtml = tempTable.querySelector('tr')?.outerHTML || breakdownRowEl.outerHTML;
        }

        const tfootHtml = pageInfo.isLast ? `
          <tfoot>
            <tr style="background: #F1F5F9; font-family: var(--font-display); font-weight: 800; font-size: 1.15rem; color: #0B1F3A; border-top: 2px solid #1D4ED8;">
              <td colspan="5" style="text-align: right; padding: 7px 16px; letter-spacing: 0.08em; text-transform: uppercase; border-right: 1px solid #CBD5E1; font-weight: 900;">
                DAILY TOTALS
              </td>
              <td style="text-align: center; padding: 7px 4px; color: #1E293B; border-right: 1px solid #CBD5E1; font-weight: 800;">
                ${pStr}
              </td>
              <td style="text-align: center; padding: 7px 4px; color: #1E293B; border-right: 1px solid #CBD5E1; font-weight: 800;">
                ${fStr}
              </td>
              <td style="text-align: center; padding: 7px 4px; color: #1E293B; border-right: 1px solid #CBD5E1; font-weight: 800;">
                ${cStr}
              </td>
              <td style="text-align: center; padding: 7px 4px; color: #0B1F3A; font-weight: 900;">
                ${calStr}
              </td>
            </tr>
            ${breakdownCloneHtml}
          </tfoot>
        ` : '';

        pageEl.innerHTML = `
          ${watermarkHtml}
          <div style="position: relative; z-index: 1; display:flex; flex-direction:column; height:100%; justify-content:space-between;">
            <div>
              ${renderHeaderHtml(!pageInfo.isFirst)}
              ${pageInfo.isFirst ? renderClientInfoHtml() : ''}
              ${pageInfo.isFirst ? renderTitleHtml() : '<div style="padding:4px 0;"></div>'}
              <div style="padding: 4px 24px 6px 24px; background: #FFFFFF;">
                <table style="width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; border: 1.5px solid #CBD5E1; border-radius: 6px; overflow: hidden;">
                  ${tableHeadHtml}
                  <tbody>
                    ${rowsHtml}
                  </tbody>
                  ${tfootHtml}
                </table>
              </div>
            </div>

            <div>
              ${pageInfo.isLast ? renderFooterSectionsHtml() : `
                <div style="background: #07152B; color: #FFFFFF; text-align: center; padding: 7px 16px; font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                  Shape Squad Fitness Centre • Consistency Builds Champions — Page ${pIdx + 1} of ${pages.length}
                </div>
              `}
            </div>
          </div>
        `;

        stage.appendChild(pageEl);

        await new Promise(res => setTimeout(res, 100));

        const canvas = await window.html2canvas(pageEl, {
          scale: 2.2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF',
          logging: false,
          windowWidth: 1122
        });

        stage.innerHTML = '';

        if (pIdx > 0) {
          pdf.addPage('a4', 'landscape');
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const imgHeight = (canvas.height * printWidth) / canvas.width;
        const yOffset = margin + Math.max(0, (printHeight - imgHeight) / 2);

        pdf.addImage(imgData, 'JPEG', margin, yOffset, printWidth, Math.min(imgHeight, printHeight), undefined, 'FAST');
      }

      const safeClient = (state.client.name || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
      const todayISO = new Date().toISOString().slice(0, 10);
      const filename = `ShapeSquad_DietChart_${safeClient}_${todayISO}.pdf`;

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

      // Native Web Share API (WhatsApp/AirDrop/Drive)
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: `Diet Chart - ${state.client.name || 'Shape Squad'}`,
            text: `Diet Chart from Shape Squad Fitness Centre${state.client.name ? ' for ' + state.client.name : ''}`
          });
          showToast('Diet Chart shared successfully!', 'success');
          return;
        } catch (shareErr) {
          if (shareErr.name !== 'AbortError') {
            console.log('Share canceled or fallback to file download...');
          }
        }
      }

      // Download fallback
      pdf.save(filename);
      showToast(`PDF "${filename}" downloaded successfully!`, 'success');

    } catch (err) {
      console.error('PDF Generation Error:', err);
      showToast('Failed to generate PDF. Please try again.', 'error');
    }
  }

  // -------------------------------------------------------------------------
  // EXCEL EXPORT (SheetJS XLSX)
  // -------------------------------------------------------------------------
  function exportToExcel() {
    if (typeof window.XLSX === 'undefined') {
      showToast('Excel library not loaded, please check connection.', 'error');
      return;
    }

    try {
      const wb = XLSX.utils.book_new();

      const rows = [
        [state.gym.name.toUpperCase()],
        [state.gym.tagline],
        [`Address: ${state.gym.address}`, `Phone: ${state.gym.phone}`, `Email: ${state.gym.email}`],
        [],
        ['CLIENT DETAILS'],
        ['Client Name:', state.client.name || '—', 'Trainer Name:', state.client.trainer || state.gym.trainerName],
        ['Date:', state.client.date || 'DD/MM/YYYY', 'Goal:', state.client.goal || '—'],
        [],
        ['DIET CHART'],
        ['S.No.', 'Meal Timing', 'Time', 'Item Name', 'Quantity', 'Protein (g)', 'Fats (g)', 'Carbs (g)', 'Calories (kcal)']
      ];

      let totP = 0, totF = 0, totC = 0, totCal = 0;

      state.mealRows.forEach((r, idx) => {
        const p = parseFloat(r.protein) || 0;
        const f = parseFloat(r.fats) || 0;
        const c = parseFloat(r.carbs) || 0;
        const cal = parseFloat(r.calories) || 0;
        totP += p; totF += f; totC += c; totCal += cal;

        rows.push([
          idx + 1,
          r.timing || '',
          r.time || '',
          r.itemName || '',
          r.quantity || '',
          r.protein !== '' ? p : '',
          r.fats !== '' ? f : '',
          r.carbs !== '' ? c : '',
          r.calories !== '' ? cal : ''
        ]);
      });

      rows.push([
        'DAILY TOTALS',
        '',
        '',
        '',
        '',
        totP,
        totF,
        totC,
        totCal
      ]);

      rows.push([]);
      rows.push(["TRAINER'S NOTES / INSTRUCTIONS:"]);
      rows.push([state.instructionsText || '']);

      const ws = XLSX.utils.aoa_to_sheet(rows);

      ws['!cols'] = [
        { wch: 8 },  // S.No.
        { wch: 18 }, // Timing
        { wch: 10 }, // Time
        { wch: 34 }, // Item Name
        { wch: 22 }, // Quantity
        { wch: 14 }, // Protein
        { wch: 14 }, // Fats
        { wch: 14 }, // Carbs
        { wch: 16 }  // Calories
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Diet Chart');

      const safeClient = (state.client.name || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `ShapeSquad_DietChart_${safeClient}_${new Date().toISOString().slice(0, 10)}.xlsx`;

      XLSX.writeFile(wb, filename);
      showToast(`Excel file "${filename}" downloaded!`, 'success');
    } catch (e) {
      console.error('Excel Export Error:', e);
      showToast('Error exporting Excel file.', 'error');
    }
  }

  // -------------------------------------------------------------------------
  // SERVICE WORKER & OFFLINE PWA CAPABILITIES
  // -------------------------------------------------------------------------
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered with scope:', registration.scope);

            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    showToast('Diet Chart Generator updated in background for offline use', 'info');
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.warn('[PWA] Service Worker registration failed:', error);
          });
      });
    }
  }

  function setupConnectivityMonitoring() {
    const offlineBanner = document.getElementById('offlineBanner');

    const updateStatus = () => {
      if (!navigator.onLine) {
        if (offlineBanner) offlineBanner.classList.add('active');
        showToast('Offline Mode: Full diet chart builder & PDF export ready without internet', 'info');
      } else {
        if (offlineBanner) offlineBanner.classList.remove('active');
      }
    };

    window.addEventListener('online', () => {
      updateStatus();
      showToast('Internet connection restored', 'success');
    });

    window.addEventListener('offline', () => {
      updateStatus();
    });

    if (!navigator.onLine) {
      updateStatus();
    }
  }

  let deferredInstallPrompt = null;

  function setupPWAInstall() {
    const btnInstall = document.getElementById('btnInstallApp');
    const mBtnInstall = document.getElementById('mBtnInstall');
    const iosModal = document.getElementById('iosInstallModalOverlay');
    const iosModalClose = document.getElementById('iosModalClose');
    const iosModalDone = document.getElementById('iosModalDone');

    // Hide if already running in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator && window.navigator.standalone === true);

    if (isStandalone) {
      if (btnInstall) btnInstall.style.display = 'none';
      if (mBtnInstall) mBtnInstall.style.display = 'none';
      return;
    }

    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      if (btnInstall) btnInstall.style.display = 'inline-flex';
      if (mBtnInstall) mBtnInstall.style.display = 'flex';
    });

    if (isIOS) {
      if (btnInstall) btnInstall.style.display = 'inline-flex';
      if (mBtnInstall) mBtnInstall.style.display = 'flex';
    }

    const triggerInstall = async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          showToast('Shape Squad Diet Studio installed to home screen!', 'success');
          if (btnInstall) btnInstall.style.display = 'none';
          if (mBtnInstall) mBtnInstall.style.display = 'none';
        }
        deferredInstallPrompt = null;
      } else if (isIOS) {
        if (iosModal) iosModal.classList.add('active');
      } else {
        showToast('To install: open browser menu (⋮) and tap "Install app" or "Add to Home screen"', 'info');
      }
    };

    if (btnInstall) btnInstall.addEventListener('click', triggerInstall);
    if (mBtnInstall) mBtnInstall.addEventListener('click', triggerInstall);

    if (iosModalClose) iosModalClose.addEventListener('click', () => iosModal.classList.remove('active'));
    if (iosModalDone) iosModalDone.addEventListener('click', () => iosModal.classList.remove('active'));
  }

  // -------------------------------------------------------------------------
  // INITIALIZATION ON DOM READY
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    loadStoredData();
    initDOMElements();
    initLogoImage(false);
    populateFoodDatalist();
    renderAll();
    attachEventListeners();
    registerServiceWorker();
    setupConnectivityMonitoring();
    setupPWAInstall();
  });

})();
