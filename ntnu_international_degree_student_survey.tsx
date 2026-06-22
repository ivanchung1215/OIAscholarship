import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// 1. 國家/地區 與 區域分組 對照表
// ==========================================
const COUNTRIES = [
  { code: 'VN', zh: '越南', en: 'Vietnam', region: 'Southeast Asia' },
  { code: 'ID', zh: '印尼', en: 'Indonesia', region: 'Southeast Asia' },
  { code: 'MY', zh: '馬來西亞', en: 'Malaysia', region: 'Southeast Asia' },
  { code: 'TH', zh: '泰國', en: 'Thailand', region: 'Southeast Asia' },
  { code: 'PH', zh: '菲律賓', en: 'Philippines', region: 'Southeast Asia' },
  { code: 'MM', zh: '緬甸', en: 'Myanmar', region: 'Southeast Asia' },
  { code: 'JP', zh: '日本', en: 'Japan', region: 'Northeast Asia' },
  { code: 'KR', zh: '韓國', en: 'South Korea', region: 'Northeast Asia' },
  { code: 'IN', zh: '印度', en: 'India', region: 'South Asia' },
  { code: 'US', zh: '美國', en: 'United States', region: 'North America' },
  { code: 'CA', zh: '加拿大', en: 'Canada', region: 'North America' },
  { code: 'FR', zh: '法國', en: 'France', region: 'Europe' },
  { code: 'DE', zh: '德國', en: 'Germany', region: 'Europe' },
  { code: 'GB', zh: '英國', en: 'United Kingdom', region: 'Europe' },
  { code: 'BR', zh: '巴西', en: 'Brazil', region: 'Central and South America' },
  { code: 'PY', zh: '巴拉圭', en: 'Paraguay', region: 'Central and South America' },
  { code: 'SZ', zh: '史瓦帝尼', en: 'Eswatini', region: 'Africa' },
  { code: 'AU', zh: '澳洲', en: 'Australia', region: 'Oceania' },
  { code: 'NZ', zh: '紐西蘭', en: 'New Zealand', region: 'Oceania' },
  { code: 'OTHER', zh: '其他國家/地區', en: 'Other Countries/Regions', region: 'Other' }
];

// ==========================================
// 2. 雙語翻譯字典 (Translations)
// ==========================================
const TRANSLATIONS = {
  zh: {
    title: "國立臺灣師範大學境外學位生問卷",
    subtitle: "境外學位生獎學金需求與敏感度問卷",
    adminTitle: "臺師大境外生問卷 - 管理後台",
    langBtn: "English",
    prev: "上一頁",
    next: "下一頁",
    submit: "確認並送出問卷",
    requiredError: "請填寫此必填項目或完成所有子題才能進入下一頁",
    submitting: "送出中...",
    thankYou: "感謝您的填答！",
    thankYouSub: "您的寶貴意見將作為精進臺師大獎學金與境外生輔導政策的重要參考。",
    reloadSurvey: "填寫新問卷",
    goAdmin: "進入管理後台",
    goSurvey: "返回問卷填寫",
    anonymousNote: "本問卷採完全匿名制，不收集姓名、學號、電子郵件或IP位址，請放心填答。",
    confirmPageTitle: "確認您的填答內容",
    confirmPageSub: "送出前請再次確認您填寫的資訊：",
    otherPlaceholder: "請輸入具體說明...",
    dragHelp: "請點擊按鈕或使用上下箭頭調整優先順序（最上方為最重要）",
    rankingReset: "重設排序",
    
    // 學院選項
    colleges: {
      edu: "教育學院",
      lib: "文學院",
      sci: "理學院",
      arts: "藝術學院",
      music: "音樂學院",
      sports: "運動與休閒學院",
      intl: "國際與社會科學院",
      mgmt: "管理學院",
      tech: "科技與工程學院",
      industry: "跨域科技產業創新研究學院"
    },

    // 財務來源
    financeSources: {
      family: "家人/親友資助",
      personal: "個人積蓄",
      taiwanGov: "臺灣政府獎學金（如教育部、外交部獎學金）",
      ntnu: "臺師大校內獎學金",
      homeGov: "母國政府獎學金",
      work: "打工/工讀收入",
      loan: "就學貸款",
      other: "其他（請說明）"
    },

    // 錄取意願
    enrollDecisions: {
      decided: "已決定入學",
      inclined: "傾向入學，但尚未完成決定",
      undecided: "尚未決定",
      notInclined: "傾向不入學",
      declined: "已決定不入學"
    },

    // 獎學金門檻
    thresholds: {
      none: "不需要獎學金",
      waiver25: "25%學費減免",
      waiver50: "50%學費減免",
      waiver100: "全額學費減免",
      waiverHousing: "全額學費減免加住宿補助",
      waiverAllowance: "全額學費減免加每月生活津貼",
      uncertain: "即使有上述補助仍不一定入學"
    }
  },
  en: {
    title: "NTNU International Degree Student Survey",
    subtitle: "Scholarship Needs & Sensitivity Survey for International & Overseas Chinese Students",
    adminTitle: "NTNU International Student Survey - Dashboard",
    langBtn: "繁體中文",
    prev: "Previous",
    next: "Next",
    submit: "Confirm and Submit",
    requiredError: "Please fill in this required field or all sub-items before proceeding",
    submitting: "Submitting...",
    thankYou: "Thank You for Your Participation!",
    thankYouSub: "Your valuable feedback will serve as an important reference for improving NTNU's scholarship policies and international student support services.",
    reloadSurvey: "Fill Another Survey",
    goAdmin: "Go to Dashboard",
    goSurvey: "Back to Survey",
    anonymousNote: "This survey is completely anonymous. We do not collect names, student IDs, emails, or IP addresses.",
    confirmPageTitle: "Review Your Answers",
    confirmPageSub: "Please review your inputs before final submission:",
    otherPlaceholder: "Please specify...",
    dragHelp: "Click buttons or use arrow controls to adjust order (Top is most preferred)",
    rankingReset: "Reset Order",

    // Colleges
    colleges: {
      edu: "College of Education",
      lib: "College of Liberal Arts",
      sci: "College of Science",
      arts: "College of Fine and Applied Arts",
      music: "College of Music",
      sports: "College of Sports and Recreation",
      intl: "College of International Studies and Social Sciences",
      mgmt: "College of Management",
      tech: "College of Technology and Engineering",
      industry: "School of Graduate Studies for Advanced Technology"
    },

    // Finance Sources
    financeSources: {
      family: "Family or relatives support",
      personal: "Personal savings",
      taiwanGov: "Taiwan Government Scholarships (e.g., MOE, MOFA)",
      ntnu: "NTNU Scholarships",
      homeGov: "Home country government scholarships",
      work: "Part-time job / campus work income",
      loan: "Student loans",
      other: "Other (Please specify)"
    },

    // Decisions
    enrollDecisions: {
      decided: "Decided to enroll",
      inclined: "Inclined to enroll, but decision not finalized",
      undecided: "Undecided",
      notInclined: "Inclined not to enroll",
      declined: "Decided not to enroll"
    },

    // Thresholds
    thresholds: {
      none: "No scholarship needed",
      waiver25: "25% tuition waiver",
      waiver50: "50% tuition waiver",
      waiver100: "Full tuition waiver",
      waiverHousing: "Full tuition waiver plus housing support",
      waiverAllowance: "Full tuition waiver plus monthly living allowance",
      uncertain: "Would not necessarily enroll even with all of the above"
    }
  }
};

// ==========================================
// 3. 核心問卷題目定義 (surveyQuestions.js + branchingLogic.js)
// ==========================================
const createQuestions = (lang, t) => [
  // ---------------- PAGE 1: 基本資料 (共同) ----------------
  {
    page: 1,
    title: { zh: "第一部分：基本資料", en: "Part 1: Basic Information" },
    fields: [
      {
        id: "respondent_status",
        type: "radio",
        required: true,
        label: { zh: "受訪者身分", en: "Respondent Status" },
        options: [
          { value: "admitted", label: { zh: "已錄取但尚未正式入學學生", en: "Admitted Student (Not yet officially enrolled)" } },
          { value: "current", label: { zh: "目前已在臺師大就讀的學位生", en: "Current Student" } }
        ]
      },
      {
        id: "student_category",
        type: "radio",
        required: true,
        label: { zh: "學生身分類別", en: "Student Category" },
        options: [
          { value: "international", label: { zh: "外國學生", en: "International Student" } },
          { value: "overseas_chinese", label: { zh: "僑生或港澳生", en: "Overseas Chinese, Hong Kong or Macau Student" } }
        ]
      },
      {
        id: "country_region",
        type: "select_country",
        required: true,
        label: { zh: "原屬國家或地區", en: "Country/Region of Origin" }
      },
      {
        id: "degree_level",
        type: "radio",
        required: true,
        label: { zh: "學制", en: "Degree Level" },
        options: [
          { value: "bachelor", label: { zh: "學士班", en: "Bachelor's Degree" } },
          { value: "master", label: { zh: "碩士班", en: "Master's Degree" } },
          { value: "phd", label: { zh: "博士班", en: "Doctoral Degree" } }
        ]
      },
      {
        id: "college",
        type: "select",
        required: true,
        label: { zh: "學院或專業領域", en: "College or Academic Field" },
        options: Object.entries(t.colleges).map(([key, val]) => ({ value: key, label: { zh: val, en: val } }))
      },
      {
        id: "primary_financial_source",
        type: "radio_with_other",
        required: true,
        label: { zh: "主要經濟來源 (單選)", en: "Primary Source of Financial Support (Single Choice)" },
        options: Object.entries(t.financeSources).map(([key, val]) => ({ value: key, label: { zh: val, en: val } }))
      },
      {
        id: "additional_financial_sources",
        type: "checkbox_with_other",
        required: false,
        label: { zh: "其他輔助經濟來源 (複選)", en: "Additional Sources of Financial Support (Multiple Choice)" },
        options: Object.entries(t.financeSources).map(([key, val]) => ({ value: key, label: { zh: val, en: val } }))
      }
    ]
  },

  // ---------------- PAGE 2: Admitted Student 專屬問卷 ----------------
  {
    page: 2,
    showIf: (ans) => ans.respondent_status === "admitted",
    title: { zh: "第二部分：入學意願與獎學金考量", en: "Part 2: Enrollment Decisions & Scholarship Considerations" },
    fields: [
      {
        id: "admitted_enrollment_decision",
        type: "radio",
        required: true,
        label: { zh: "A. 您目前的入學決定是？", en: "A. What is your current enrollment decision?" },
        options: [
          { value: "decided", label: { zh: t.enrollDecisions.decided, en: t.enrollDecisions.decided } },
          { value: "inclined", label: { zh: t.enrollDecisions.inclined, en: t.enrollDecisions.inclined } },
          { value: "undecided", label: { zh: t.enrollDecisions.undecided, en: t.enrollDecisions.undecided } },
          { value: "not_inclined", label: { zh: t.enrollDecisions.notInclined, en: t.enrollDecisions.notInclined } },
          { value: "declined", label: { zh: t.enrollDecisions.declined, en: t.enrollDecisions.declined } }
        ]
      },
      {
        id: "admitted_enrollment_factors",
        type: "matrix_7",
        required: true,
        label: { zh: "B. 各項因素對您決定是否就讀臺師大的重要性？", en: "B. How important are these factors in your decision to enroll at NTNU?" },
        minLabel: { zh: "完全不重要", en: "Not important at all" },
        maxLabel: { zh: "非常重要", en: "Extremely important" },
        rows: [
          { id: "factor_scholarship_amount", label: { zh: "獎學金金額", en: "Scholarship amount" } },
          { id: "factor_tuition_waiver", label: { zh: "學費減免", en: "Tuition waiver" } },
          { id: "factor_living_allowance", label: { zh: "每月生活津貼", en: "Monthly living allowance" } },
          { id: "factor_reputation", label: { zh: "學校或科系聲譽", en: "University or program reputation" } },
          { id: "factor_resources", label: { zh: "課程與研究資源", en: "Academic and research resources" } },
          { id: "factor_living_cost", label: { zh: "臺灣生活費", en: "Cost of living in Taiwan" } },
          { id: "factor_housing", label: { zh: "住宿費及住宿取得", en: "Housing cost and availability" } },
          { id: "factor_career_ops", label: { zh: "實習及就業機會", en: "Internship and employment opportunities" } },
          { id: "factor_family", label: { zh: "家人意見", en: "Family opinion" } },
          { id: "factor_other_offers", label: { zh: "其他學校提供的條件", en: "Offers from other universities" } }
        ]
      }
    ]
  },
  {
    page: 3,
    showIf: (ans) => ans.respondent_status === "admitted",
    title: { zh: "第三部分：獎學金狀況與敏感度測試", en: "Part 3: Scholarship Status & Sensitivity Scenarios" },
    fields: [
      {
        id: "admitted_scholarship_status",
        type: "radio",
        required: true,
        label: { zh: "C. 您是否已獲得任何來自臺灣/臺師大的獎學金？", en: "C. Have you received any scholarships from Taiwan or NTNU?" },
        options: [
          { value: "awarded", label: { zh: "已獲得", en: "Yes, awarded" } },
          { value: "not_awarded", label: { zh: "未獲得", en: "No, not awarded" } },
          { value: "pending", label: { zh: "申請中或等待結果", en: "Applied & awaiting results" } },
          { value: "uncertain", label: { zh: "不確定", en: "Uncertain" } }
        ]
      },
      // 條件分支：當 admitted_scholarship_status === 'awarded' 時顯示
      {
        id: "admitted_scholarship_source",
        type: "radio_with_other",
        required: true,
        showIf: (ans) => ans.admitted_scholarship_status === "awarded",
        label: { zh: "（已獲獎者）獎學金來源", en: "(For awarded students) Scholarship Source" },
        options: [
          { value: "ntnu", label: { zh: "國立臺灣師範大學 (NTNU)", en: "National Taiwan Normal University" } },
          { value: "taiwan_gov", label: { zh: "臺灣政府 (如教育部、外交部獎學金)", en: "Taiwan Government (e.g. MOE, MOFA)" } },
          { value: "other", label: { zh: "其他（請說明）", en: "Other (Please specify)" } }
        ]
      },
      {
        id: "admitted_scholarship_type",
        type: "checkbox",
        required: true,
        showIf: (ans) => ans.admitted_scholarship_status === "awarded",
        label: { zh: "（已獲獎者）獎學金補助形式 (可複選)", en: "(For awarded students) Scholarship Type (Select all that apply)" },
        options: [
          { value: "tuition_waiver", label: { zh: "學雜費減免", en: "Tuition & fees waiver" } },
          { value: "living_allowance", label: { zh: "每月生活津貼", en: "Monthly living allowance" } },
          { value: "housing", label: { zh: "住宿費補助或免費住宿", en: "Housing subsidy or free dorm" } },
          { value: "flight", label: { zh: "機票補助", en: "Airfare subsidy" } }
        ]
      },
      {
        id: "admitted_scholarship_duration",
        type: "radio",
        required: true,
        showIf: (ans) => ans.admitted_scholarship_status === "awarded",
        label: { zh: "（已獲獎者）獎學金提供期限", en: "(For awarded students) Scholarship Duration" },
        options: [
          { value: "1_year", label: { zh: "僅提供第一年", en: "1 Year (First year only)" } },
          { value: "full_degree", label: { zh: "涵蓋正規修業年限 (須逐年審核)", en: "Full degree length (subject to annual review)" } },
          { value: "other", label: { zh: "其他", en: "Other" } }
        ]
      },
      {
        id: "admitted_estimated_coverage",
        type: "radio",
        required: true,
        showIf: (ans) => ans.admitted_scholarship_status === "awarded",
        label: { zh: "（已獲獎者）估計此獎學金能涵蓋您在台支出的比例", en: "(For awarded students) Estimated percentage of total costs covered in Taiwan" },
        options: [
          { value: "under_25", label: { zh: "25% 以下", en: "Under 25%" } },
          { value: "25_50", label: { zh: "25% - 50%", en: "25% to 50%" } },
          { value: "50_75", label: { zh: "50% - 75%", en: "50% to 75%" } },
          { value: "75_100", label: { zh: "75% - 100%", en: "75% to 100%" } }
        ]
      },
      // D. Minimum Scholarship Threshold
      {
        id: "admitted_minimum_threshold",
        type: "radio",
        required: true,
        label: { zh: "D. 對您而言，願意前來臺師大就讀的「最低」獎學金門檻為何？", en: "D. What is the MINIMUM scholarship support you require to enroll at NTNU?" },
        options: [
          { value: "none", label: { zh: t.thresholds.none, en: t.thresholds.none } },
          { value: "waiver25", label: { zh: t.thresholds.waiver25, en: t.thresholds.waiver25 } },
          { value: "waiver50", label: { zh: t.thresholds.waiver50, en: t.thresholds.waiver50 } },
          { value: "waiver100", label: { zh: t.thresholds.waiver100, en: t.thresholds.waiver100 } },
          { value: "waiver_housing", label: { zh: t.thresholds.waiverHousing, en: t.thresholds.waiverHousing } },
          { value: "waiver_allowance", label: { zh: t.thresholds.waiverAllowance, en: t.thresholds.waiverAllowance } },
          { value: "uncertain", label: { zh: t.thresholds.uncertain, en: t.thresholds.uncertain } }
        ]
      }
    ]
  },
  {
    page: 4,
    showIf: (ans) => ans.respondent_status === "admitted",
    title: { zh: "第四部分：情境意願與偏好排序", en: "Part 4: Scenario Willingness & Preference Ranking" },
    fields: [
      {
        id: "admitted_scenario_test",
        type: "matrix_7",
        required: true,
        label: { zh: "E. 獎學金情境測試：在下列補助條件下，您入學臺師大的意願？", en: "E. Scholarship Scenario Test: How likely are you to enroll under these conditions?" },
        minLabel: { zh: "一定不會入學", en: "Definitely would not enroll" },
        maxLabel: { zh: "一定會入學", en: "Definitely would enroll" },
        rows: [
          { id: "scen_no_scholarship", label: { zh: "無獎學金", en: "No scholarship" } },
          { id: "scen_waiver_25", label: { zh: "25%學費減免", en: "25% tuition waiver" } },
          { id: "scen_waiver_50", label: { zh: "50%學費減免", en: "50% tuition waiver" } },
          { id: "scen_waiver_100", label: { zh: "全額學費減免", en: "Full tuition waiver" } },
          { id: "scen_allowance_only", label: { zh: "僅提供每月生活津貼 (不減免學費)", en: "Monthly living allowance only" } },
          { id: "scen_waiver_and_allowance", label: { zh: "全額學費減免 加 每月生活津貼", en: "Full tuition waiver plus monthly allowance" } },
          { id: "scen_waiver_and_housing", label: { zh: "學費減免 加 住宿補助", en: "Tuition waiver plus housing support" } }
        ]
      },
      {
        id: "admitted_preference_ranking",
        type: "ranking",
        required: true,
        label: { zh: "F. 獎學金方案偏好排序 (請依重要性調整順序，最上方為最偏好)", en: "F. Scholarship Preference Ranking (Order by preference, top is highest)" },
        options: [
          { value: "tuition_waiver", label: { zh: "學費減免", en: "Tuition waiver" } },
          { value: "living_allowance", label: { zh: "每月生活津貼", en: "Monthly living allowance" } },
          { value: "housing_subsidy", label: { zh: "住宿補助", en: "Housing subsidy" } },
          { value: "higher_first_year", label: { zh: "第一年較高額補助", en: "Higher first-year scholarship" } },
          { value: "fixed_annual", label: { zh: "每年固定補助", en: "Fixed annual scholarship" } },
          { value: "emergency_aid", label: { zh: "急難補助", en: "Emergency financial aid" } },
          { value: "campus_work", label: { zh: "實習或工讀機會", en: "Internship or campus work opportunity" } }
        ]
      }
    ]
  },
  {
    page: 5,
    showIf: (ans) => ans.respondent_status === "admitted",
    title: { zh: "第五部分：取捨選擇與不確定原因", en: "Part 5: Trade-off Questions & Uncertainty Reasons" },
    fields: [
      {
        id: "admitted_tradeoff_1",
        type: "radio",
        required: true,
        label: { zh: "G1. 方案取捨一", en: "G1. Trade-off Question 1" },
        options: [
          { value: "A", label: { zh: "A：學校或科系聲譽較高，但沒有獎學金", en: "A: High university/program reputation, but NO scholarship" } },
          { value: "B", label: { zh: "B：學校或科系聲譽普通，但提供50%學費減免", en: "B: Average university/program reputation, with 50% tuition waiver" } }
        ]
      },
      {
        id: "admitted_tradeoff_2",
        type: "radio",
        required: true,
        label: { zh: "G2. 方案取捨二", en: "G2. Trade-off Question 2" },
        options: [
          { value: "A", label: { zh: "A：全額學費減免，但沒有生活津貼", en: "A: Full tuition waiver, but NO monthly living allowance" } },
          { value: "B", label: { zh: "B：50%學費減免，加每月生活津貼", en: "B: 50% tuition waiver PLUS monthly living allowance" } }
        ]
      },
      {
        id: "admitted_tradeoff_3",
        type: "radio",
        required: true,
        label: { zh: "G3. 方案取捨三", en: "G3. Trade-off Question 3" },
        options: [
          { value: "A", label: { zh: "A：獎學金較少，但實習及留臺就業資源較多", en: "A: Lower scholarship amount, but richer internship/local career support" } },
          { value: "B", label: { zh: "B：獎學金較高，但實習及就業資源較少", en: "B: Higher scholarship amount, but limited career resources" } }
        ]
      },
      {
        id: "admitted_uncertainty_reasons",
        type: "checkbox_limit_3",
        required: false,
        label: { zh: "H. 若您對於入學臺師大仍有不確定性，主要原因為何？ (複選，最多選三項)", en: "H. What are the primary reasons for your uncertainty about enrolling at NTNU? (Select up to 3)" },
        options: [
          { value: "financial", label: { zh: "經濟負擔重 / 獎學金不足", en: "Heavy financial burden / insufficient scholarship" } },
          { value: "better_offer", label: { zh: "已獲得其他更佳的學校錄取與條件", en: "Better offers from other universities" } },
          { value: "language", label: { zh: "對自身中文或英語授課適應能力有疑慮", en: "Concerns about language/instruction adaptibility" } },
          { value: "visa", label: { zh: "簽證申請或來臺手續繁複", en: "Complex visa or entry procedures" } },
          { value: "housing", label: { zh: "擔心在臺灣的住宿與生活適應問題", en: "Concerns about housing or living in Taiwan" } },
          { value: "family", label: { zh: "家人不贊成或不支持出國留學", en: "Family discouragement or lack of support" } },
          { value: "career", label: { zh: "臺灣畢業後的就業優勢不明確", en: "Unclear career advantages after graduation" } }
        ]
      }
    ]
  },

  // ---------------- PAGE 6: Current Student 專屬問卷 ----------------
  {
    page: 2,
    showIf: (ans) => ans.respondent_status === "current",
    title: { zh: "第二部分：目前在學獎學金狀態與生活壓力", en: "Part 2: Current Scholarship Status & Financial Pressure" },
    fields: [
      {
        id: "current_scholarship_status",
        type: "radio",
        required: true,
        label: { zh: "A. 您目前在台就讀期間，是否有獲得任何獎學金？", en: "A. Do you currently hold any scholarships while studying at NTNU?" },
        options: [
          { value: "awarded", label: { zh: "目前有獎學金", en: "Yes, currently holding" } },
          { value: "none", label: { zh: "目前沒有獎學金", en: "No, currently none" } },
          { value: "stopped", label: { zh: "曾經有，但目前已停止", en: "Used to have, but stopped" } },
          { value: "pending", label: { zh: "正在申請或等待結果", en: "Applying / awaiting results" } }
        ]
      },
      // B. Scholarship Details (限目前有獎學金者顯示)
      {
        id: "current_scholarship_source",
        type: "radio_with_other",
        required: true,
        showIf: (ans) => ans.current_scholarship_status === "awarded",
        label: { zh: "（有獎學金者）您的獎學金來源為何？", en: "(For scholarship holders) What is your scholarship source?" },
        options: [
          { value: "ntnu", label: { zh: "臺師大校內獎學金", en: "NTNU Scholarship" } },
          { value: "taiwan_gov", label: { zh: "臺灣政府獎學金 (如教育部、外交部獎學金)", en: "Taiwan Government Scholarships" } },
          { value: "home_gov", label: { zh: "母國政府獎學金", en: "Home country government scholarships" } },
          { value: "other", label: { zh: "其他（請說明）", en: "Other (Please specify)" } }
        ]
      },
      {
        id: "current_scholarship_type",
        type: "checkbox",
        required: true,
        showIf: (ans) => ans.current_scholarship_status === "awarded",
        label: { zh: "（有獎學金者）您的獎學金補助形式 (可複選)", en: "(For scholarship holders) Scholarship type (Select all that apply)" },
        options: [
          { value: "tuition_waiver", label: { zh: "學費減免", en: "Tuition waiver" } },
          { value: "living_allowance", label: { zh: "每月生活津貼", en: "Monthly living allowance" } },
          { value: "housing", label: { zh: "住宿補助", en: "Housing support/subsidy" } },
          { value: "other", label: { zh: "其他補助", en: "Other subsidies" } }
        ]
      },
      {
        id: "current_scholarship_coverage",
        type: "radio",
        required: true,
        showIf: (ans) => ans.current_scholarship_status === "awarded",
        label: { zh: "（有獎學金者）此獎學金能涵蓋您目前在台總開銷 (學費+生活費) 的比例？", en: "(For scholarship holders) What percentage of your total costs is covered by the scholarship?" },
        options: [
          { value: "under_25", label: { zh: "25% 以下", en: "Under 25%" } },
          { value: "25_50", label: { zh: "25% - 50%", en: "25% to 50%" } },
          { value: "50_75", label: { zh: "50% - 75%", en: "50% to 75%" } },
          { value: "75_100", label: { zh: "75% - 100%", en: "75% to 100%" } }
        ]
      },
      {
        id: "current_scholarship_duration",
        type: "radio",
        required: true,
        showIf: (ans) => ans.current_scholarship_status === "awarded",
        label: { zh: "（有獎學金者）您的獎學金期限為多長？", en: "(For scholarship holders) What is the duration of your scholarship?" },
        options: [
          { value: "1_semester", label: { zh: "一學期 (須每學期重新審查)", en: "One semester (reviewed every semester)" } },
          { value: "1_year", label: { zh: "一學年 (須每學年重新審查)", en: "One academic year (reviewed annually)" } },
          { value: "full_degree", label: { zh: "整段學制年限", en: "Full degree duration" } }
        ]
      },
      // C. Financial Pressure
      {
        id: "current_financial_pressure",
        type: "matrix_7",
        required: true,
        label: { zh: "C. 您目前在台灣求學，面臨以下項目的經濟壓力程度？", en: "C. Rate your current financial pressure regarding the following items:" },
        minLabel: { zh: "完全沒有壓力", en: "No pressure at all" },
        maxLabel: { zh: "壓力非常大", en: "Extremely high pressure" },
        rows: [
          { id: "press_tuition", label: { zh: "學費及雜費", en: "Tuition & fees" } },
          { id: "press_housing", label: { zh: "住宿開銷", en: "Housing cost" } },
          { id: "press_living", label: { zh: "日常伙食與生活費", en: "Daily living expenses" } },
          { id: "press_medical", label: { zh: "醫療與健保費", en: "Medical care and insurance" } },
          { id: "press_books", label: { zh: "書籍及學術研究支出", en: "Books and research expenses" } },
          { id: "press_transport", label: { zh: "交通交通費 (含往返母國)", en: "Transportation" } },
          { id: "press_visa", label: { zh: "簽證與居留證等規費", en: "Visa and residence-related fees" } },
          { id: "press_emergency", label: { zh: "突發緊急支出", en: "Emergency expenses" } }
        ]
      }
    ]
  },
  {
    page: 3,
    showIf: (ans) => ans.respondent_status === "current",
    title: { zh: "第三部分：經濟行為與獎學金敏感度", en: "Part 3: Financial Behaviors & Sensitivity" },
    fields: [
      {
        id: "current_financial_behaviors",
        type: "checkbox",
        required: true,
        label: { zh: "D. 為了應對經濟壓力，您曾經或正在採取哪些行為？ (可複選)", en: "D. What behaviors have you taken to cope with financial pressure? (Select all that apply)" },
        options: [
          { value: "work_more", label: { zh: "增加工讀或打工時間", en: "Increase part-time job or campus work hours" } },
          { value: "cut_expenses", label: { zh: "減少餐飲與生活日常支出", en: "Cut down on food and daily expenses" } },
          { value: "cheaper_housing", label: { zh: "搬到租金較便宜的住所", en: "Move to a cheaper accommodation" } },
          { value: "reduce_courses", label: { zh: "減少修課或暫停學術/學習活動", en: "Reduce course load or study activities" } },
          { value: "delay_grad", label: { zh: "延後畢業 (以求能繼續半工半讀)", en: "Delay graduation to continue working" } },
          { value: "borrow_family", label: { zh: "向親朋好友借款", en: "Borrow money from family or friends" } },
          { value: "loan", label: { zh: "申請就學貸款", en: "Apply for student loans" } },
          { value: "suspend", label: { zh: "考慮辦理休學或退學", en: "Consider academic suspension or withdrawal" } },
          { value: "transfer", label: { zh: "考慮轉學到其他學校或前往其他國家", en: "Consider transferring to another university/country" } },
          { value: "none", label: { zh: "無上述情形，財務狀況尚屬寬裕", en: "None of the above (Comfortable financially)" } }
        ]
      },
      // E. Scholarship Reduction Sensitivity (限目前有獎學金者顯示)
      {
        id: "current_reduction_sensitivity",
        type: "matrix_7",
        required: true,
        showIf: (ans) => ans.current_scholarship_status === "awarded",
        label: { zh: "E. 獎學金減少敏感度：若您目前的獎學金產生變動，您「繼續留在台師大就讀」的意願？", en: "E. Scholarship Reduction Sensitivity: If your current scholarship changes, how likely are you to continue studying at NTNU?" },
        minLabel: { zh: "完全無法繼續", en: "Definitely unable to continue" },
        maxLabel: { zh: "一定會繼續就讀", en: "Definitely continue studying" },
        rows: [
          { id: "scen_keep_current", label: { zh: "維持目前的獎學金不變", en: "Keep current scholarship unchanged" } },
          { id: "scen_reduce_25", label: { zh: "減少 25% 獎學金額度", en: "Reduce scholarship by 25%" } },
          { id: "scen_reduce_50", label: { zh: "減少 50% 獎學金額度", en: "Reduce scholarship by 50%" } },
          { id: "scen_only_waiver", label: { zh: "只保留學費減免 (取消生活津貼/住宿補助)", en: "Keep tuition waiver only (Cancel allowances/housing)" } },
          { id: "scen_only_allowance", label: { zh: "只保留生活津貼 (取消學費減免)", en: "Keep living allowance only (Cancel tuition waiver)" } },
          { id: "scen_stop_all", label: { zh: "完全停止獎學金", en: "Stop scholarship completely" } }
        ]
      },
      // F. New Support Sensitivity (限目前沒有獎學金者顯示)
      {
        id: "current_new_support_sensitivity",
        type: "matrix_7",
        required: true,
        showIf: (ans) => ans.current_scholarship_status !== "awarded",
        label: { zh: "F. 補助增設意願：若未來學校提供以下補助，能對您在學就讀帶來多大的正面幫助？", en: "F. Helpfulness of New Support: How much would these supports help you continue studying?" },
        minLabel: { zh: "完全沒有幫助", en: "Not helpful at all" },
        maxLabel: { zh: "非常有正面幫助", en: "Extremely helpful" },
        rows: [
          { id: "new_waiver_25", label: { zh: "提供 25% 學費減免", en: "Provide 25% tuition waiver" } },
          { id: "new_waiver_50", label: { zh: "提供 50% 學費減免", en: "Provide 50% tuition waiver" } },
          { id: "new_allowance", label: { zh: "提供每月定額生活津貼", en: "Provide monthly living allowance" } },
          { id: "new_housing", label: { zh: "提供校內免費住宿或定額住宿補助", en: "Provide free dorm or housing subsidy" } },
          { id: "new_emergency", label: { zh: "提供突發家庭重大變故之急難補助", en: "Provide emergency financial aid" } },
          { id: "new_campus_job", label: { zh: "增加校內工讀機會與彈性時數", en: "Provide more campus work opportunities" } }
        ]
      }
    ]
  },
  {
    page: 4,
    showIf: (ans) => ans.respondent_status === "current",
    title: { zh: "第四部分：偏好選擇與申請障礙", en: "Part 4: Preferences & Application Barriers" },
    fields: [
      {
        id: "current_scholarship_preference",
        type: "ranking_limit_3",
        required: true,
        label: { zh: "G. 獎學金偏好：在以下各項補助中，您認為哪幾項對境外學生的「實際幫助最大」？請依序選出最有幫助的三項並排序 (Top 1 為最推薦)", en: "G. Scholarship Preference: Choose and rank the top 3 most helpful supports (Top 1 is most helpful)" },
        options: [
          { value: "tuition_waiver", label: { zh: "學費減免", en: "Tuition waiver" } },
          { value: "living_allowance", label: { zh: "生活津貼", en: "Living allowance" } },
          { value: "housing_subsidy", label: { zh: "住宿補助", en: "Housing subsidy" } },
          { value: "insurance_subsidy", label: { zh: "保險費補助 (例如全民健保補助)", en: "Insurance subsidy (e.g. NHI)" } },
          { value: "books_materials", label: { zh: "教材或學術研究補助", en: "Textbooks or research materials subsidy" } },
          { value: "emergency_aid", label: { zh: "突發急難救助金", en: "Emergency financial aid" } },
          { value: "campus_work", label: { zh: "工讀或實習機會 (有給薪)", en: "Paid campus work or internships" } },
          { value: "transport_subsidy", label: { zh: "交通補助 (含返鄉機票)", en: "Transportation / airfare subsidy" } }
        ]
      },
      {
        id: "current_application_barriers",
        type: "checkbox",
        required: true,
        label: { zh: "H. 您在申請校內外獎學金時，曾遇到過哪些困難？ (可複選)", en: "H. What barriers did you face when applying for scholarships? (Select all that apply)" },
        options: [
          { value: "not_aware", label: { zh: "不知道有哪些獎學金可以申請", en: "Unaware of available scholarships" } },
          { value: "unclear_eligibility", label: { zh: "申請資格規定不清或難以理解", en: "Unclear or confusing eligibility requirements" } },
          { value: "unclear_deadline", label: { zh: "申請期限與日程不明確", en: "Unclear deadlines and schedules" } },
          { value: "too_many_docs", label: { zh: "要求準備的文件過多或太繁複", en: "Too many document requirements" } },
          { value: "system_issue", label: { zh: "線上申請系統操作困難或常有錯誤", en: "Hard to use online application system" } },
          { value: "language_barrier", label: { zh: "缺乏外語/英文資訊說明", en: "Lack of English/foreign language translations" } },
          { value: "high_grades_threshold", label: { zh: "學業成績門檻要求過高", en: "Academic performance threshold is too high" } },
          { value: "limited_quotas", label: { zh: "獎學金的名額過少", en: "Extremely limited quotas" } },
          { value: "long_wait", label: { zh: "申請後的等待審查時間過長", en: "Waiting time for results is too long" } },
          { value: "no_feedback", label: { zh: "不清楚未獲獎的原因或評審回饋", en: "No explanation provided for unawarded applications" } },
          { value: "no_difficulty", label: { zh: "一切順利，沒有遇到明顯困難", en: "No difficulties faced" } },
          { value: "never_applied", label: { zh: "在學期間未曾申請過任何獎學金", en: "Have never applied during my studies" } }
        ]
      }
    ]
  },
  {
    page: 5,
    showIf: (ans) => ans.respondent_status === "current",
    title: { zh: "第五部分：續領條件接受度", en: "Part 5: Renewal Conditions Acceptance" },
    fields: [
      {
        id: "current_renewal_conditions",
        type: "matrix_7",
        required: true,
        label: { zh: "I. 續領條件：若獎學金規定須符合以下條件才能在次年「續領」，您的接受程度？", en: "I. Renewal Conditions: How acceptable are these requirements for you to renew your scholarship next year?" },
        minLabel: { zh: "完全無法接受", en: "Completely unacceptable" },
        maxLabel: { zh: "完全可以接受", en: "Completely acceptable" },
        rows: [
          { id: "renew_grades", label: { zh: "維持在班級前一定比例或維持一定平均成績", en: "Maintain a certain GPA or class ranking" } },
          { id: "renew_credits", label: { zh: "每學期修滿一定比例的最低學分數", en: "Complete a minimum number of credits each semester" } },
          { id: "renew_years", label: { zh: "在規定年限內畢業 (不得延畢)", en: "Graduate within standard duration (no delay)" } },
          { id: "renew_service", label: { zh: "完成一定時數的校內服務學習或行政支援", en: "Complete certain hours of campus service or administrative support" } },
          { id: "renew_activities", label: { zh: "主動參加指定數量的國際交流與校內推廣活動", en: "Participate in a specified number of international events" } },
          { id: "renew_chinese", label: { zh: "通過或完成指定程度的華語課程或檢定", en: "Meet Chinese language proficiency requirements" } },
          { id: "renew_career", label: { zh: "參與學校舉辦的實習、職涯輔導與就業媒合活動", en: "Participate in campus career counseling/internship activities" } },
          { id: "renew_progress", label: { zh: "每學期定期提交詳細的學術研究/學習進度成果報告", en: "Submit academic progress reports periodically" } }
        ]
      }
    ]
  },
  {
    page: 6,
    showIf: (ans) => ans.respondent_status === "current",
    title: { zh: "第六部分：在校生活、服務滿意度與留台就業意願", en: "Part 6: Campus Adaptation, Service Satisfaction & Career Intention" },
    fields: [
      {
        id: "current_campus_adaptation",
        type: "matrix_7",
        required: true,
        label: { zh: "1. 請問您目前在臺灣師範大學的整體「在校生活適應」狀況？", en: "1. How well have you adapted to student life at NTNU?" },
        minLabel: { zh: "非常不適應", en: "Very poorly adapted" },
        maxLabel: { zh: "非常適應", en: "Extremely well adapted" },
        rows: [
          { id: "adapt_academic", label: { zh: "課業與學術研究適應", en: "Academic and research adaptation" } },
          { id: "adapt_language", label: { zh: "生活與教學語言適應", en: "Language adaptation (everyday & instruction)" } },
          { id: "adapt_culture", label: { zh: "臺灣在地文化與社交融入", en: "Social and cultural integration in Taiwan" } },
          { id: "adapt_living", label: { zh: "校內外住宿與飲食生活適應", en: "Housing and daily life adaptation" } }
        ]
      },
      // 國際處服務使用分支
      {
        id: "current_oia_services_used",
        type: "checkbox",
        required: true,
        label: { zh: "2. 請問您「曾使用過」國際事務處 (OIA) 的哪些服務項目？ (可複選)", en: "2. Which Office of International Affairs (OIA) services have you ever used? (Select all that apply)" },
        options: [
          { value: "oia_admission", label: { zh: "招生諮詢與錄取分發業務", en: "Admission & enrollment services" } },
          { value: "oia_scholarship", label: { zh: "境外生獎學金申請與發放", en: "Scholarship application & disbursement" } },
          { value: "oia_activities", label: { zh: "國際生交流活動與節慶晚會", en: "Cultural exchange events & parties" } },
          { value: "oia_orientation", label: { zh: "新生入學輔導說明會與生活手冊", en: "New student orientation & handbook" } },
          { value: "oia_visa", label: { zh: "居留證、簽證、工作許可申辦協助", en: "Visa, ARC, and work permit assistance" } },
          { value: "none", label: { zh: "我從未主動使用過國際處的任何服務", en: "I have never used any OIA services" } }
        ]
      },
      // 服務滿意度 (只有在上面有選該項服務，才會顯示該項滿意度評分)
      {
        id: "current_oia_services_satisfaction",
        type: "matrix_7",
        required: true,
        showIf: (ans) => ans.current_oia_services_used && ans.current_oia_services_used.length > 0 && !ans.current_oia_services_used.includes("none"),
        label: { zh: "3. 針對您「使用過」的服務項目，請提供滿意度評分：", en: "3. For services you have USED, please rate your satisfaction:" },
        minLabel: { zh: "非常不滿意", en: "Very dissatisfied" },
        maxLabel: { zh: "非常滿意", en: "Very satisfied" },
        rows: [
          { id: "sat_oia_admission", label: { zh: "招生諮詢與錄取分發業務", en: "Admission & enrollment services" }, showIf: (ans) => ans.current_oia_services_used?.includes("oia_admission") },
          { id: "sat_oia_scholarship", label: { zh: "境外生獎學金申請與發放", en: "Scholarship application & disbursement" }, showIf: (ans) => ans.current_oia_services_used?.includes("oia_scholarship") },
          { id: "sat_oia_activities", label: { zh: "國際生交流活動與節慶晚會", en: "Cultural exchange events & parties" }, showIf: (ans) => ans.current_oia_services_used?.includes("oia_activities") },
          { id: "sat_oia_orientation", label: { zh: "新生入學輔導說明會與生活手冊", en: "New student orientation & handbook" }, showIf: (ans) => ans.current_oia_services_used?.includes("oia_orientation") },
          { id: "sat_oia_visa", label: { zh: "居留證、簽證、工作許可申辦協助", en: "Visa, ARC, and work permit assistance" }, showIf: (ans) => ans.current_oia_services_used?.includes("oia_visa") }
        ]
      },
      // 未使用原因 (限沒用過服務者)
      {
        id: "current_oia_nonuse_reasons",
        type: "checkbox_with_other",
        required: true,
        showIf: (ans) => ans.current_oia_services_used?.includes("none"),
        label: { zh: "4. （沒使用過任何服務者）請問您不常或未使用國際處服務的原因為？ (可複選)", en: "4. (For non-users) Why have you not used OIA services? (Select all that apply)" },
        options: [
          { value: "no_need", label: { zh: "平常沒有特別需求，自己能處理好", en: "No need, I can handle everything myself" } },
          { value: "not_aware", label: { zh: "不知道國際處有提供這些服務", en: "Unaware of services provided by OIA" } },
          { value: "location", label: { zh: "國際處辦公室地點不方便或過遠", en: "OIA office location is inconvenient/far" } },
          { value: "language", label: { zh: "擔心語言溝通障礙或回覆過慢", en: "Language barriers or slow response times" } },
          { value: "complicated", label: { zh: "辦理流程繁複，手續過多", en: "The process is too complex and tedious" } }
        ]
      },
      // 5. Activity Awareness
      {
        id: "current_oia_activity_awareness",
        type: "radio",
        required: true,
        label: { zh: "5. 請問您對於校內舉辦的境外生交流/節慶活動的資訊知悉與參與狀況？", en: "5. How aware and involved are you in OIA cultural events?" },
        options: [
          { value: "highly_involved", label: { zh: "經常知悉且樂於報名參與", en: "Highly aware and frequently participate" } },
          { value: "aware_not_join", label: { zh: "知道有活動，但因時間、課業或沒興趣等原因鮮少參加", en: "Aware of events but rarely participate (time/interest)" } },
          { value: "not_aware", label: { zh: "平常不太知道有這些活動的舉辦訊息", en: "Rarely aware of these events" } }
        ]
      },
      // 6. Intention to Work in Taiwan
      {
        id: "current_intention_to_work_taiwan",
        type: "radio",
        required: true,
        label: { zh: "6. 請問您在畢業後，是否打算或希望能夠留在臺灣工作？", en: "6. Do you intend or hope to stay and work in Taiwan after graduation?" },
        options: [
          { value: "yes_definitely", label: { zh: "是的，極具意願且已在做準備", en: "Yes, definitely, and I am preparing" } },
          { value: "yes_conditional", label: { zh: "有機會的話想留，視有沒有好職缺或法規鬆綁而定", en: "Would like to, conditionally (depends on jobs/visa)" } },
          { value: "no_return", label: { zh: "不打算留，計畫畢業後立即返回母國", en: "No, plan to return to home country immediately" } },
          { value: "no_third_country", label: { zh: "不打算留，計畫畢業後前往其他國家發展/深造", en: "No, plan to go to a third country for work/studies" } },
          { value: "undecided", label: { zh: "尚未決定或目前無特別想法", en: "Undecided" } }
        ]
      },
      // 7. Employment Support Needed
      {
        id: "current_employment_support_needed",
        type: "checkbox_with_other",
        required: true,
        label: { zh: "7. 為了協助您順利留臺就業，您認為學校最需要提供什麼支持？ (可複選)", en: "7. What employment supports do you need most from NTNU to stay in Taiwan? (Select all that apply)" },
        options: [
          { value: "job_fairs", label: { zh: "專為境外生舉辦的徵才說明會與就業博覽會", en: "Job fairs tailored specifically for international students" } },
          { value: "legal_consulting", label: { zh: "評點制、工作簽證及居留法規的專業諮詢", en: "Consultations on work visa regulations & point system" } },
          { value: "chinese_business", label: { zh: "開設商務華語與面試中文技巧培訓課程", en: "Business Chinese and interview skills training" } },
          { value: "resume_service", label: { zh: "中英文履歷一對一修改諮詢服務", en: "One-on-one English/Chinese resume review" } },
          { value: "internships", label: { zh: "媒合更多臺灣企業的實習與產學合作管道", en: "More internships and enterprise partnerships" } },
          { value: "alumni_networking", label: { zh: "畢業在臺就業校友的經驗分享與人脈建立", en: "Alumni networking with graduates working in Taiwan" } }
        ]
      }
    ]
  }
];

// ==========================================
// 4. 資料庫讀寫服務層 (dataService.js)
// ==========================================
const STORAGE_KEY = "NTNU_SURVEY_RESPONSES";

const dataService = {
  // 獲取所有填答資料
  getAllResponses: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to read from localStorage", e);
      return [];
    }
  },

  // 儲存新的填答 (將會自動生成長格式與寬格式所需資料)
  saveResponse: (rawAnswers, language) => {
    try {
      const allResponses = dataService.getAllResponses();
      const respondentId = "RESP-" + Math.random().toString(36).substring(2, 11).toUpperCase() + "-" + Date.now().toString().slice(-4);
      const submittedAt = new Date().toISOString();

      // 計算國家/地區的分組 region_group
      const countryObj = COUNTRIES.find(c => c.code === rawAnswers.country_region);
      const regionGroup = countryObj ? countryObj.region : "Other";

      const formattedAnswers = {
        respondent_id: respondentId,
        submitted_at: submittedAt,
        language: language,
        respondent_status: rawAnswers.respondent_status,
        student_category: rawAnswers.student_category,
        country_region: rawAnswers.country_region,
        region_group: regionGroup,
        degree_level: rawAnswers.degree_level,
        college: rawAnswers.college,
        primary_financial_source: rawAnswers.primary_financial_source?.value || rawAnswers.primary_financial_source,
        primary_financial_source_other: rawAnswers.primary_financial_source?.other || "",
        additional_financial_sources: Array.isArray(rawAnswers.additional_financial_sources) 
          ? rawAnswers.additional_financial_sources.map(v => typeof v === 'object' ? v.value : v)
          : (rawAnswers.additional_financial_sources?.value ? [rawAnswers.additional_financial_sources.value] : []),
        additional_financial_sources_other: rawAnswers.additional_financial_sources?.other || "",
        raw_answers: rawAnswers // 完整原始資料
      };

      allResponses.push(formattedAnswers);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allResponses));
      return respondentId;
    } catch (e) {
      console.error("Failed to save response", e);
      return null;
    }
  },

  // 匯出長格式資料
  exportLongFormat: (responses) => {
    const longRows = [];
    responses.forEach(resp => {
      const raw = resp.raw_answers || {};
      
      // 遍歷所有欄位
      Object.entries(raw).forEach(([qId, val]) => {
        if (val === undefined || val === null || qId === 'respondent_id' || qId === 'submitted_at') return;

        // 如果是矩陣題，將每個子題拆成單獨列
        if (typeof val === 'object' && !Array.isArray(val) && val.isMatrix) {
          Object.entries(val.values || {}).forEach(([subId, score]) => {
            longRows.push({
              respondent_id: resp.respondent_id,
              submitted_at: resp.submitted_at,
              language: resp.language,
              respondent_status: resp.respondent_status,
              student_category: resp.student_category,
              country_region: resp.country_region,
              region_group: resp.region_group,
              degree_level: resp.degree_level,
              college: resp.college,
              primary_financial_source: resp.primary_financial_source,
              additional_financial_sources: resp.additional_financial_sources?.join(';'),
              question_id: `${qId}_${subId}`,
              question_text_zh: `${qId} - ${subId}`,
              question_text_en: `${qId} - ${subId}`,
              answer_value: score,
              answer_label_zh: `${score} 分`,
              answer_label_en: `${score} points`
            });
          });
        } 
        // 如果是多選題
        else if (Array.isArray(val)) {
          val.forEach(item => {
            const itemVal = typeof item === 'object' ? item.value : item;
            longRows.push({
              respondent_id: resp.respondent_id,
              submitted_at: resp.submitted_at,
              language: resp.language,
              respondent_status: resp.respondent_status,
              student_category: resp.student_category,
              country_region: resp.country_region,
              region_group: resp.region_group,
              degree_level: resp.degree_level,
              college: resp.college,
              primary_financial_source: resp.primary_financial_source,
              additional_financial_sources: resp.additional_financial_sources?.join(';'),
              question_id: qId,
              question_text_zh: qId,
              question_text_en: qId,
              answer_value: itemVal,
              answer_label_zh: itemVal,
              answer_label_en: itemVal
            });
          });
        }
        // 如果是自訂帶有 "其他" 的輸入
        else if (typeof val === 'object' && val.value !== undefined) {
          longRows.push({
            respondent_id: resp.respondent_id,
            submitted_at: resp.submitted_at,
            language: resp.language,
            respondent_status: resp.respondent_status,
            student_category: resp.student_category,
            country_region: resp.country_region,
            region_group: resp.region_group,
            degree_level: resp.degree_level,
            college: resp.college,
            primary_financial_source: resp.primary_financial_source,
            additional_financial_sources: resp.additional_financial_sources?.join(';'),
            question_id: qId,
            question_text_zh: qId,
            question_text_en: qId,
            answer_value: val.value,
            answer_label_zh: val.other ? `其他: ${val.other}` : val.value,
            answer_label_en: val.other ? `Other: ${val.other}` : val.value
          });
        }
        // 一般單選題
        else {
          longRows.push({
            respondent_id: resp.respondent_id,
            submitted_at: resp.submitted_at,
            language: resp.language,
            respondent_status: resp.respondent_status,
            student_category: resp.student_category,
            country_region: resp.country_region,
            region_group: resp.region_group,
            degree_level: resp.degree_level,
            college: resp.college,
            primary_financial_source: resp.primary_financial_source,
            additional_financial_sources: resp.additional_financial_sources?.join(';'),
            question_id: qId,
            question_text_zh: qId,
            question_text_en: qId,
            answer_value: val,
            answer_label_zh: val,
            answer_label_en: val
          });
        }
      });
    });
    return longRows;
  },

  // 匯出寬格式資料
  exportWideFormat: (responses) => {
    return responses.map(resp => {
      const raw = resp.raw_answers || {};
      const flat = {
        respondent_id: resp.respondent_id,
        submitted_at: resp.submitted_at,
        language: resp.language,
        respondent_status: resp.respondent_status,
        student_category: resp.student_category,
        country_region: resp.country_region,
        region_group: resp.region_group,
        degree_level: resp.degree_level,
        college: resp.college,
        primary_financial_source: resp.primary_financial_source,
        primary_financial_source_other: resp.primary_financial_source_other,
        additional_financial_sources: resp.additional_financial_sources?.join(';'),
        additional_financial_sources_other: resp.additional_financial_sources_other
      };

      // 拍平其餘題目答案
      Object.entries(raw).forEach(([qId, val]) => {
        if (val === undefined || val === null || [
          'respondent_status', 'student_category', 'country_region', 
          'degree_level', 'college', 'primary_financial_source', 'additional_financial_sources'
        ].includes(qId)) return;

        if (typeof val === 'object' && !Array.isArray(val) && val.isMatrix) {
          Object.entries(val.values || {}).forEach(([subId, score]) => {
            flat[`${qId}_${subId}`] = score;
          });
        } else if (Array.isArray(val)) {
          flat[qId] = val.map(v => typeof v === 'object' ? v.value : v).join(';');
          if (val.some(v => v.other)) {
            flat[`${qId}_other`] = val.find(v => v.other)?.other || "";
          }
        } else if (typeof val === 'object' && val.value !== undefined) {
          flat[qId] = val.value;
          if (val.other) flat[`${qId}_other`] = val.other;
        } else {
          flat[qId] = val;
        }
      });

      return flat;
    });
  }
};

// ==========================================
// 5. 產生模擬資料庫 (Mock Data Generation)
// ==========================================
const generateMockData = () => {
  const mockResponses = [];
  const totalMock = 120; // 模擬 120 份填答
  
  for (let i = 0; i < totalMock; i++) {
    const respondentStatus = Math.random() > 0.45 ? "current" : "admitted";
    const studentCategory = Math.random() > 0.35 ? "international" : "overseas_chinese";
    
    // 選擇隨機國家並取得分組
    const country = COUNTRIES[Math.floor(Math.random() * (COUNTRIES.length - 1))]; // 排除最後一項 Other
    const regionGroup = country.region;
    
    const degreeLevel = Math.random() > 0.7 ? "phd" : (Math.random() > 0.4 ? "master" : "bachelor");
    const collegesKeys = ['edu', 'lib', 'sci', 'arts', 'music', 'sports', 'intl', 'mgmt', 'tech', 'industry'];
    const college = collegesKeys[Math.floor(Math.random() * collegesKeys.length)];
    
    const primaryFinancial = Math.random() > 0.5 ? "family" : (Math.random() > 0.3 ? "taiwanGov" : "ntnu");
    
    const raw_answers = {
      respondent_status: respondentStatus,
      student_category: studentCategory,
      country_region: country.code,
      degree_level: degreeLevel,
      college: college,
      primary_financial_source: primaryFinancial
    };

    if (respondentStatus === "admitted") {
      raw_answers.admitted_enrollment_decision = Math.random() > 0.4 ? "decided" : (Math.random() > 0.5 ? "inclined" : "undecided");
      raw_answers.admitted_enrollment_factors = {
        isMatrix: true,
        values: {
          factor_scholarship_amount: Math.floor(Math.random() * 3) + 5, // 5-7 分
          factor_tuition_waiver: Math.floor(Math.random() * 3) + 5,
          factor_living_allowance: Math.floor(Math.random() * 4) + 4,
          factor_reputation: Math.floor(Math.random() * 3) + 5,
          factor_resources: Math.floor(Math.random() * 3) + 5,
          factor_living_cost: Math.floor(Math.random() * 4) + 4,
          factor_housing: Math.floor(Math.random() * 3) + 5,
          factor_career_ops: Math.floor(Math.random() * 3) + 5,
          factor_family: Math.floor(Math.random() * 5) + 2,
          factor_other_offers: Math.floor(Math.random() * 4) + 3
        }
      };
      
      const isAwarded = Math.random() > 0.4 ? "awarded" : "not_awarded";
      raw_answers.admitted_scholarship_status = isAwarded;
      if (isAwarded === "awarded") {
        raw_answers.admitted_scholarship_source = Math.random() > 0.5 ? "ntnu" : "taiwan_gov";
        raw_answers.admitted_scholarship_type = ["tuition_waiver", "living_allowance"];
        raw_answers.admitted_scholarship_duration = "full_degree";
        raw_answers.admitted_estimated_coverage = "50_75";
      }
      
      raw_answers.admitted_minimum_threshold = Math.random() > 0.4 ? "waiver_allowance" : "waiver100";
      raw_answers.admitted_scenario_test = {
        isMatrix: true,
        values: {
          scen_no_scholarship: Math.floor(Math.random() * 3) + 1, // 1-3
          scen_waiver_25: Math.floor(Math.random() * 3) + 2, // 2-4
          scen_waiver_50: Math.floor(Math.random() * 3) + 4, // 4-6
          scen_waiver_100: Math.floor(Math.random() * 2) + 6, // 6-7
          scen_allowance_only: Math.floor(Math.random() * 3) + 4,
          scen_waiver_and_allowance: 7,
          scen_waiver_and_housing: Math.floor(Math.random() * 2) + 6
        }
      };
      
      raw_answers.admitted_preference_ranking = ["tuition_waiver", "living_allowance", "housing_subsidy", "higher_first_year", "fixed_annual", "emergency_aid", "campus_work"];
      raw_answers.admitted_tradeoff_1 = Math.random() > 0.3 ? "A" : "B";
      raw_answers.admitted_tradeoff_2 = Math.random() > 0.5 ? "A" : "B";
      raw_answers.admitted_tradeoff_3 = Math.random() > 0.4 ? "A" : "B";
    } else {
      // Current Student Mock
      const isAwarded = Math.random() > 0.3 ? "awarded" : "none";
      raw_answers.current_scholarship_status = isAwarded;
      if (isAwarded === "awarded") {
        raw_answers.current_scholarship_source = Math.random() > 0.6 ? "ntnu" : "taiwan_gov";
        raw_answers.current_scholarship_type = ["tuition_waiver", "living_allowance"];
        raw_answers.current_scholarship_coverage = "50_75";
        raw_answers.current_scholarship_duration = "full_degree";

        raw_answers.current_reduction_sensitivity = {
          isMatrix: true,
          values: {
            scen_keep_current: Math.floor(Math.random() * 2) + 6, // 6-7
            scen_reduce_25: Math.floor(Math.random() * 3) + 4, // 4-6
            scen_reduce_50: Math.floor(Math.random() * 3) + 2, // 2-4
            scen_only_waiver: Math.floor(Math.random() * 4) + 3,
            scen_only_allowance: Math.floor(Math.random() * 4) + 2,
            scen_stop_all: Math.floor(Math.random() * 2) + 1 // 1-2
          }
        };
      } else {
        raw_answers.current_new_support_sensitivity = {
          isMatrix: true,
          values: {
            new_waiver_25: Math.floor(Math.random() * 3) + 3,
            new_waiver_50: Math.floor(Math.random() * 3) + 5,
            new_allowance: Math.floor(Math.random() * 2) + 6,
            new_housing: Math.floor(Math.random() * 2) + 6,
            new_emergency: Math.floor(Math.random() * 3) + 4,
            new_campus_job: Math.floor(Math.random() * 3) + 4
          }
        };
      }

      raw_answers.current_financial_pressure = {
        isMatrix: true,
        values: {
          press_tuition: Math.floor(Math.random() * 4) + 4, // 4-7
          press_housing: Math.floor(Math.random() * 3) + 5, // 5-7
          press_living: Math.floor(Math.random() * 3) + 5,
          press_medical: Math.floor(Math.random() * 4) + 2,
          press_books: Math.floor(Math.random() * 4) + 2,
          press_transport: Math.floor(Math.random() * 3) + 4,
          press_visa: Math.floor(Math.random() * 3) + 2,
          press_emergency: Math.floor(Math.random() * 3) + 4
        }
      };

      raw_answers.current_financial_behaviors = Math.random() > 0.5 ? ["work_more", "cut_expenses"] : ["cut_expenses"];
      raw_answers.current_scholarship_preference = ["tuition_waiver", "living_allowance", "housing_subsidy"];
      raw_answers.current_application_barriers = Math.random() > 0.4 ? ["not_aware", "too_many_docs"] : ["no_difficulty"];
      raw_answers.current_renewal_conditions = {
        isMatrix: true,
        values: {
          renew_grades: Math.floor(Math.random() * 3) + 5, // 5-7
          renew_credits: Math.floor(Math.random() * 3) + 5,
          renew_years: Math.floor(Math.random() * 3) + 5,
          renew_service: Math.floor(Math.random() * 4) + 3,
          renew_activities: Math.floor(Math.random() * 4) + 4,
          renew_chinese: Math.floor(Math.random() * 5) + 2,
          renew_career: Math.floor(Math.random() * 3) + 5,
          renew_progress: Math.floor(Math.random() * 3) + 5
        }
      };

      raw_answers.current_campus_adaptation = {
        isMatrix: true,
        values: {
          adapt_academic: Math.floor(Math.random() * 3) + 4,
          adapt_language: Math.floor(Math.random() * 3) + 4,
          adapt_culture: Math.floor(Math.random() * 3) + 4,
          adapt_living: Math.floor(Math.random() * 3) + 4
        }
      };

      raw_answers.current_oia_services_used = ["oia_admission", "oia_scholarship"];
      raw_answers.current_oia_services_satisfaction = {
        isMatrix: true,
        values: {
          sat_oia_admission: Math.floor(Math.random() * 3) + 5,
          sat_oia_scholarship: Math.floor(Math.random() * 4) + 4
        }
      };

      raw_answers.current_oia_activity_awareness = Math.random() > 0.4 ? "highly_involved" : "aware_not_join";
      raw_answers.current_intention_to_work_taiwan = Math.random() > 0.3 ? "yes_conditional" : "yes_definitely";
      raw_answers.current_employment_support_needed = ["job_fairs", "legal_consulting"];
    }

    const respondentId = "RESP-MOCK" + (i + 1000).toString();
    const submittedAt = new Date(Date.now() - Math.random() * 30 * 24 * 3600 * 1000).toISOString();

    mockResponses.push({
      respondent_id: respondentId,
      submitted_at: submittedAt,
      language: Math.random() > 0.5 ? "zh" : "en",
      respondent_status: respondentStatus,
      student_category: studentCategory,
      country_region: country.code,
      region_group: regionGroup,
      degree_level: degreeLevel,
      college: college,
      primary_financial_source: primaryFinancial,
      additional_financial_sources: [],
      raw_answers: raw_answers
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockResponses));
};

// ==========================================
// 6. 主要 React 元件 (App)
// ==========================================
export default function App() {
  const [lang, setLang] = useState('zh');
  const [view, setView] = useState('survey'); // 'survey' | 'admin'
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastRespondentId, setLastRespondentId] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  // 系統字典
  const t = TRANSLATIONS[lang];

  // 加載與初始模擬數據判斷
  useEffect(() => {
    const existing = dataService.getAllResponses();
    if (existing.length === 0) {
      generateMockData();
    }
  }, []);

  // 取得篩選後/過濾後之全量題目定義
  const allQuestions = useMemo(() => createQuestions(lang, t), [lang, t]);
  
  // 計算目前身分下的總分流頁面
  const activePages = useMemo(() => {
    const pages = [1]; // 基本資料永遠存在
    const status = surveyAnswers.respondent_status;
    if (!status) return pages;

    allQuestions.forEach(q => {
      if (q.page > 1) {
        if (!q.showIf || q.showIf(surveyAnswers)) {
          if (!pages.includes(q.page)) {
            pages.push(q.page);
          }
        }
      }
    });
    return pages.sort((a, b) => a - b);
  }, [surveyAnswers, allQuestions]);

  const progressPercent = useMemo(() => {
    const currentIdx = activePages.indexOf(currentPage);
    if (currentIdx === -1) return 0;
    return Math.round(((currentIdx + 1) / activePages.length) * 100);
  }, [currentPage, activePages]);

  // 取出目前頁面的題目群組
  const currentFields = useMemo(() => {
    const pageObj = allQuestions.find(q => q.page === currentPage && (!q.showIf || q.showIf(surveyAnswers)));
    return pageObj ? pageObj.fields : [];
  }, [currentPage, allQuestions, surveyAnswers]);

  // 處理單一欄位數值改變
  const handleFieldChange = (fieldId, val) => {
    setSurveyAnswers(prev => {
      const newAns = { ...prev, [fieldId]: val };
      
      // 當變更基本身分時，重置後續欄位以防邏輯干擾
      if (fieldId === "respondent_status") {
        // 保留 Page 1 基本欄位，清除其他
        const cleanAns = {
          respondent_status: val,
          student_category: prev.student_category,
          country_region: prev.country_region,
          degree_level: prev.degree_level,
          college: prev.college,
          primary_financial_source: prev.primary_financial_source,
          additional_financial_sources: prev.additional_financial_sources
        };
        return cleanAns;
      }
      return newAns;
    });
  };

  // 頁面防呆：驗證目前必填欄位
  const validateCurrentPage = () => {
    for (let f of currentFields) {
      if (!f.showIf || f.showIf(surveyAnswers)) {
        const val = surveyAnswers[f.id];
        if (f.required) {
          if (val === undefined || val === null || val === '') return false;
          // 若為矩陣題
          if (f.type === 'matrix_7') {
            const keys = f.rows.filter(r => !r.showIf || r.showIf(surveyAnswers)).map(r => r.id);
            if (!val.values) return false;
            for (let k of keys) {
              if (val.values[k] === undefined || val.values[k] === null) return false;
            }
          }
          // 若為排序題
          if (f.type === 'ranking' || f.type === 'ranking_limit_3') {
            if (!Array.isArray(val) || val.length === 0) return false;
            if (f.type === 'ranking_limit_3' && val.length < 3) return false;
          }
        }
      }
    }
    return true;
  };

  // 上一頁 / 下一頁
  const handleNext = () => {
    if (!validateCurrentPage()) {
      alert(t.requiredError);
      return;
    }
    const currentIdx = activePages.indexOf(currentPage);
    if (currentIdx < activePages.length - 1) {
      setCurrentPage(activePages[currentIdx + 1]);
    } else {
      // 進入預覽確認頁面
      setIsConfirming(true);
    }
  };

  const handlePrev = () => {
    if (isConfirming) {
      setIsConfirming(false);
      return;
    }
    const currentIdx = activePages.indexOf(currentPage);
    if (currentIdx > 0) {
      setCurrentPage(activePages[currentIdx - 1]);
    }
  };

  // 最終送出問卷
  const handleSubmitSurvey = () => {
    const id = dataService.saveResponse(surveyAnswers, lang);
    if (id) {
      setLastRespondentId(id);
      setIsSubmitted(true);
      setIsConfirming(false);
      // 清空問卷狀態
      setSurveyAnswers({});
      setCurrentPage(1);
    }
  };

  // 重啟新問卷
  const handleResetSurvey = () => {
    setIsSubmitted(false);
    setIsConfirming(false);
    setSurveyAnswers({});
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-colors duration-200">
      
      {/* 頂部通用導航導覽列 */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-red-700 text-white font-bold p-2 rounded-lg text-sm tracking-wider">NTNU</div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm md:text-base">{t.title}</h1>
            <p className="text-xs text-slate-500 hidden md:block">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 切換中英文 */}
          <button 
            onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
            className="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
          >
            {t.langBtn}
          </button>

          {/* 視圖導航按鈕 */}
          {view === 'survey' ? (
            <button
              onClick={() => setView('admin')}
              className="px-3 py-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-full transition"
            >
              {t.goAdmin}
            </button>
          ) : (
            <button
              onClick={() => setView('survey')}
              className="px-3 py-1 text-xs font-semibold bg-red-700 hover:bg-red-800 text-white rounded-full transition"
            >
              {t.goSurvey}
            </button>
          )}
        </div>
      </header>

      {/* 主體區塊 */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:py-8">
        {view === 'survey' ? (
          // =========================================================
          // 【問卷填答區塊】
          // =========================================================
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 md:p-10 relative overflow-hidden transition-all duration-300">
            {/* 進度條 */}
            {!isSubmitted && (
              <div className="mb-6">
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-700 transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {isSubmitted ? (
              // 送出完成頁面
              <div className="text-center py-12 px-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t.thankYou}</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">{t.thankYouSub}</p>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-sm mx-auto text-left mb-8">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Anonymous Respondent ID</div>
                  <div className="font-mono text-slate-700 select-all font-semibold break-all">{lastRespondentId}</div>
                  <div className="text-[10px] text-slate-400 mt-2">＊本標記僅供學術比對使用，不含任何可識別之個資</div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    onClick={handleResetSurvey}
                    className="w-full sm:w-auto px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transition"
                  >
                    {t.reloadSurvey}
                  </button>
                  <button
                    onClick={() => setView('admin')}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                  >
                    {t.goAdmin}
                  </button>
                </div>
              </div>
            ) : isConfirming ? (
              // 送出前答案確認預覽頁面
              <ConfirmAnswersView 
                answers={surveyAnswers} 
                allQuestions={allQuestions} 
                lang={lang} 
                t={t} 
                onPrev={handlePrev} 
                onSubmit={handleSubmitSurvey} 
              />
            ) : (
              // 一般問卷題目填答頁
              <div>
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    {allQuestions.find(q => q.page === currentPage)?.title[lang]}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{t.anonymousNote}</p>
                </div>

                <div className="space-y-8">
                  {currentFields.map(field => {
                    if (field.showIf && !field.showIf(surveyAnswers)) return null;

                    return (
                      <div key={field.id} className="border-b border-slate-100 pb-6 last:border-0">
                        <label className="block text-slate-900 font-bold text-base mb-3">
                          {field.label[lang]}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {/* 下拉選單國家搜尋 (包含特別處理) */}
                        {field.type === "select_country" && (
                          <div className="max-w-md">
                            <select
                              value={surveyAnswers[field.id] || ""}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                            >
                              <option value="">-- Choose Country / Region --</option>
                              {COUNTRIES.map(c => (
                                <option key={c.code} value={c.code}>
                                  {lang === 'zh' ? `${c.zh} (${c.en})` : c.en}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* 標準下拉選單 */}
                        {field.type === "select" && (
                          <div className="max-w-md">
                            <select
                              value={surveyAnswers[field.id] || ""}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                            >
                              <option value="">-- Choose --</option>
                              {field.options.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label[lang]}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* 單選題 */}
                        {field.type === "radio" && (
                          <div className="space-y-2">
                            {field.options.map(opt => (
                              <label key={opt.value} className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition">
                                <input
                                  type="radio"
                                  name={field.id}
                                  value={opt.value}
                                  checked={surveyAnswers[field.id] === opt.value}
                                  onChange={() => handleFieldChange(field.id, opt.value)}
                                  className="mt-1 h-4 w-4 text-red-700 focus:ring-red-500 border-slate-300"
                                />
                                <span className="text-sm text-slate-700">{opt.label[lang]}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* 單選題 + 「其他」客製文字欄位 */}
                        {field.type === "radio_with_other" && (
                          <div className="space-y-2">
                            {field.options.map(opt => {
                              const isSelected = surveyAnswers[field.id]?.value === opt.value || surveyAnswers[field.id] === opt.value;
                              return (
                                <div key={opt.value} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition">
                                  <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={field.id}
                                      value={opt.value}
                                      checked={isSelected}
                                      onChange={() => handleFieldChange(field.id, { value: opt.value, other: "" })}
                                      className="mt-1 h-4 w-4 text-red-700 focus:ring-red-500 border-slate-300"
                                    />
                                    <span className="text-sm text-slate-700">{opt.label[lang]}</span>
                                  </label>
                                  {opt.value === 'other' && isSelected && (
                                    <input
                                      type="text"
                                      placeholder={t.otherPlaceholder}
                                      value={surveyAnswers[field.id]?.other || ""}
                                      onChange={(e) => handleFieldChange(field.id, { value: 'other', other: e.target.value })}
                                      className="mt-2 ml-7 w-full max-w-sm border border-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-red-500"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* 多選題 */}
                        {field.type === "checkbox" && (
                          <div className="space-y-2">
                            {field.options.map(opt => {
                              const currentList = Array.isArray(surveyAnswers[field.id]) ? surveyAnswers[field.id] : [];
                              const isChecked = currentList.includes(opt.value);
                              return (
                                <label key={opt.value} className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition">
                                  <input
                                    type="checkbox"
                                    value={opt.value}
                                    checked={isChecked}
                                    onChange={(e) => {
                                      let newList = [...currentList];
                                      if (e.target.checked) {
                                        newList.push(opt.value);
                                      } else {
                                        newList = newList.filter(item => item !== opt.value);
                                      }
                                      handleFieldChange(field.id, newList);
                                    }}
                                    className="mt-1 h-4 w-4 text-red-700 focus:ring-red-500 border-slate-300 rounded"
                                  />
                                  <span className="text-sm text-slate-700">{opt.label[lang]}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* 多選題限制最長選3項 */}
                        {field.type === "checkbox_limit_3" && (
                          <div className="space-y-2">
                            {field.options.map(opt => {
                              const currentList = Array.isArray(surveyAnswers[field.id]) ? surveyAnswers[field.id] : [];
                              const isChecked = currentList.includes(opt.value);
                              return (
                                <label key={opt.value} className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition">
                                  <input
                                    type="checkbox"
                                    value={opt.value}
                                    checked={isChecked}
                                    disabled={!isChecked && currentList.length >= 3}
                                    onChange={(e) => {
                                      let newList = [...currentList];
                                      if (e.target.checked) {
                                        if (newList.length < 3) newList.push(opt.value);
                                      } else {
                                        newList = newList.filter(item => item !== opt.value);
                                      }
                                      handleFieldChange(field.id, newList);
                                    }}
                                    className="mt-1 h-4 w-4 text-red-700 focus:ring-red-500 border-slate-300 rounded"
                                  />
                                  <span className="text-sm text-slate-700">{opt.label[lang]}</span>
                                </label>
                              );
                            })}
                            <p className="text-xs text-red-600 font-medium">最多可選 3 項 (Max 3 selections)</p>
                          </div>
                        )}

                        {/* 多選題 + 「其他」客製欄位 */}
                        {field.type === "checkbox_with_other" && (
                          <div className="space-y-2">
                            {field.options.map(opt => {
                              const currentList = Array.isArray(surveyAnswers[field.id]) ? surveyAnswers[field.id] : [];
                              const isChecked = currentList.includes(opt.value);
                              return (
                                <div key={opt.value} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition">
                                  <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      value={opt.value}
                                      checked={isChecked}
                                      onChange={(e) => {
                                        let newList = [...currentList];
                                        if (e.target.checked) {
                                          newList.push(opt.value);
                                        } else {
                                          newList = newList.filter(item => item !== opt.value);
                                        }
                                        handleFieldChange(field.id, newList);
                                      }}
                                      className="mt-1 h-4 w-4 text-red-700 focus:ring-red-500 border-slate-300 rounded"
                                    />
                                    <span className="text-sm text-slate-700">{opt.label[lang]}</span>
                                  </label>
                                  {opt.value === 'other' && isChecked && (
                                    <input
                                      type="text"
                                      placeholder={t.otherPlaceholder}
                                      value={surveyAnswers[field.id + "_other"] || ""}
                                      onChange={(e) => handleFieldChange(field.id + "_other", e.target.value)}
                                      className="mt-2 ml-7 w-full max-w-sm border border-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-red-500"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* 七點量表矩陣 */}
                        {field.type === "matrix_7" && (
                          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                            <table className="w-full min-w-[600px] border-collapse text-left">
                              <thead>
                                <tr className="border-b border-slate-200 text-xs font-bold text-slate-400">
                                  <th className="py-3 pr-4 w-1/3">{field.label[lang]}</th>
                                  <th colSpan="7" className="py-3 text-center">
                                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-2">
                                      <span>1 ({field.minLabel[lang]})</span>
                                      <span>4</span>
                                      <span>7 ({field.maxLabel[lang]})</span>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {field.rows.map(row => {
                                  if (row.showIf && !row.showIf(surveyAnswers)) return null;

                                  const currentVal = surveyAnswers[field.id]?.values?.[row.id];
                                  return (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                      <td className="py-3.5 pr-4 text-sm text-slate-700 font-medium">
                                        {row.label[lang]}
                                      </td>
                                      {[1, 2, 3, 4, 5, 6, 7].map(score => (
                                        <td key={score} className="py-3.5 text-center">
                                          <label className="block cursor-pointer p-1">
                                            <input
                                              type="radio"
                                              name={`${field.id}_${row.id}`}
                                              value={score}
                                              checked={currentVal === score}
                                              onChange={() => {
                                                const currentMatrixObj = surveyAnswers[field.id] || { isMatrix: true, values: {} };
                                                const newValues = { ...currentMatrixObj.values, [row.id]: score };
                                                handleFieldChange(field.id, { isMatrix: true, values: newValues });
                                              }}
                                              className="h-4 w-4 text-red-700 focus:ring-red-500 border-slate-300"
                                            />
                                            <span className="block text-[10px] text-slate-400 mt-1">{score}</span>
                                          </label>
                                        </td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* 拖曳/手動上下排序 */}
                        {field.type === "ranking" && (
                          <div className="max-w-xl">
                            <p className="text-xs text-slate-400 mb-3">{t.dragHelp}</p>
                            <RankingWidget
                              options={field.options}
                              value={surveyAnswers[field.id] || field.options.map(o => o.value)}
                              onChange={(newOrder) => handleFieldChange(field.id, newOrder)}
                              lang={lang}
                              t={t}
                            />
                          </div>
                        )}

                        {/* 選擇特定三項並排序 */}
                        {field.type === "ranking_limit_3" && (
                          <div className="max-w-xl">
                            <p className="text-xs text-red-600 mb-3">請點選最有效的 3 個項目並排序 (請依重要度依序點擊)</p>
                            <RankingLimitWidget
                              options={field.options}
                              value={surveyAnswers[field.id] || []}
                              onChange={(newSelection) => handleFieldChange(field.id, newSelection)}
                              lang={lang}
                              t={t}
                            />
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

                {/* 前後頁按鈕 */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={handlePrev}
                    disabled={activePages.indexOf(currentPage) === 0}
                    className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← {t.prev}
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold shadow transition"
                  >
                    {activePages.indexOf(currentPage) === activePages.length - 1 ? t.submit : `${t.next} →`}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // =========================================================
          // 【管理員 Dashboard 區塊】
          // =========================================================
          <AdminDashboard lang={lang} t={t} onBackToSurvey={() => setView('survey')} />
        )}
      </main>

      {/* 頁尾 */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs border-t border-slate-800">
        <p>© {new Date().getFullYear()} National Taiwan Normal University. All Rights Reserved.</p>
        <p className="mt-1 text-slate-500">國立臺灣師範大學境外學位生獎學金意願調查系統</p>
      </footer>
    </div>
  );
}

// ==========================================
// 7. 排序元件 (Ranking Widgets)
// ==========================================
function RankingWidget({ options, value, onChange, lang }) {
  const currentItems = useMemo(() => {
    return value.map(val => options.find(o => o.value === val)).filter(Boolean);
  }, [value, options]);

  const moveItem = (index, direction) => {
    const updated = [...value];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    
    // 交換位置
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {currentItems.map((item, index) => (
        <div key={item.value} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-red-100 text-red-800 text-xs font-bold rounded-full flex items-center justify-center">
              {index + 1}
            </span>
            <span className="text-sm font-medium text-slate-700">{item.label[lang]}</span>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => moveItem(index, -1)}
              disabled={index === 0}
              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
              title="Move Up"
            >
              ▲
            </button>
            <button
              onClick={() => moveItem(index, 1)}
              disabled={index === currentItems.length - 1}
              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
              title="Move Down"
            >
              ▼
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RankingLimitWidget({ options, value, onChange, lang, t }) {
  const toggleSelect = (val) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      if (value.length < 3) {
        onChange([...value, val]);
      }
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {options.map(opt => {
          const rankIdx = value.indexOf(opt.value);
          const isSelected = rankIdx !== -1;
          return (
            <button
              key={opt.value}
              onClick={() => toggleSelect(opt.value)}
              className={`p-3 text-left rounded-lg border text-xs font-medium flex items-center justify-between transition ${
                isSelected 
                  ? "bg-red-50 border-red-300 text-red-900" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{opt.label[lang]}</span>
              {isSelected ? (
                <span className="bg-red-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {rankIdx + 1}
                </span>
              ) : (
                <span className="w-5 h-5 border border-slate-300 rounded-full flex items-center justify-center text-[10px] text-slate-400">
                  +
                </span>
              )}
            </button>
          );
        })}
      </div>
      {value.length > 0 && (
        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
          <span>目前已排序: <strong>{value.length} / 3</strong></span>
          <button onClick={() => onChange([])} className="text-red-700 hover:underline">{t.rankingReset}</button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. 問卷確認頁面 (ConfirmAnswersView)
// ==========================================
function ConfirmAnswersView({ answers, allQuestions, lang, t, onPrev, onSubmit }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.confirmPageTitle}</h2>
      <p className="text-sm text-slate-500 mb-6">{t.confirmPageSub}</p>

      <div className="space-y-6 max-h-[50vh] overflow-y-auto border border-slate-200 rounded-xl p-4 bg-slate-50 mb-6">
        {allQuestions.map(q => {
          if (q.showIf && !q.showIf(answers)) return null;

          return (
            <div key={q.page} className="border-b border-slate-200 pb-4 last:border-0">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{q.title[lang]}</h3>
              <div className="space-y-3">
                {q.fields.map(f => {
                  if (f.showIf && !f.showIf(answers)) return null;
                  const val = answers[f.id];

                  return (
                    <div key={f.id} className="text-xs">
                      <div className="font-bold text-slate-700">{f.label[lang]}</div>
                      <div className="text-slate-600 mt-1 pl-2 border-l-2 border-red-700 font-medium">
                        {renderValueSummary(f, val, lang, t)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-slate-200">
        <button
          onClick={onPrev}
          className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition"
        >
          ← {t.prev}
        </button>
        <button
          onClick={onSubmit}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold shadow-lg transition"
        >
          {t.submit}
        </button>
      </div>
    </div>
  );
}

function renderValueSummary(field, val, lang, t) {
  if (val === undefined || val === null || val === '') return "Unfilled / 無";

  if (field.type === "select_country") {
    const c = COUNTRIES.find(x => x.code === val);
    return c ? (lang === 'zh' ? c.zh : c.en) : val;
  }

  if (field.type === "matrix_7") {
    return (
      <ul className="list-disc list-inside space-y-0.5">
        {field.rows.map(r => {
          if (r.showIf && !r.showIf(val)) return null;
          return (
            <li key={r.id}>
              {r.label[lang]}: <strong className="text-red-700">{val.values?.[r.id] || "No score"}</strong>
            </li>
          );
        })}
      </ul>
    );
  }

  if (field.type === "ranking" || field.type === "ranking_limit_3") {
    return val.map((v, idx) => {
      const opt = field.options.find(o => o.value === v);
      return `${idx + 1}. ${opt?.label[lang] || v}`;
    }).join(" → ");
  }

  if (Array.isArray(val)) {
    return val.map(v => {
      const opt = field.options.find(o => o.value === v);
      return opt?.label[lang] || v;
    }).join(", ");
  }

  if (typeof val === 'object' && val.value) {
    const opt = field.options.find(o => o.value === val.value);
    const label = opt?.label[lang] || val.value;
    return val.other ? `${label} (${val.other})` : label;
  }

  const foundOpt = field.options?.find(o => o.value === val);
  return foundOpt ? foundOpt.label[lang] : val;
}

// ==========================================
// 9. 後台管理分析儀表板 (AdminDashboard component)
// ==========================================
function AdminDashboard({ lang, t, onBackToSurvey }) {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'willingness' | 'services' | 'raw'
  
  // 篩選器狀態
  const [filters, setFilters] = useState({
    respondent_status: "",
    student_category: "",
    region_group: "",
    degree_level: "",
    college: "",
    scholarship_status: ""
  });

  // 更新數據
  const refreshData = () => {
    setData(dataService.getAllResponses());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // 重置模擬數據
  const handleRegenerate = () => {
    if (confirm("是否重新產生 120 份精準模擬統計數據？（這將會清空目前 localStorage 上的所有自填資料）")) {
      generateMockData();
      refreshData();
    }
  };

  // 篩選處理
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const raw = item.raw_answers || {};
      
      if (filters.respondent_status && item.respondent_status !== filters.respondent_status) return false;
      if (filters.student_category && item.student_category !== filters.student_category) return false;
      if (filters.region_group && item.region_group !== filters.region_group) return false;
      if (filters.degree_level && item.degree_level !== filters.degree_level) return false;
      if (filters.college && item.college !== filters.college) return false;
      
      if (filters.scholarship_status) {
        const schStatus = item.respondent_status === 'admitted' 
          ? raw.admitted_scholarship_status 
          : raw.current_scholarship_status;
        if (schStatus !== filters.scholarship_status) return false;
      }
      return true;
    });
  }, [data, filters]);

  // 14 大核心指標與交叉統計運算
  const stats = useMemo(() => {
    const total = filteredData.length;
    const admittedCount = filteredData.filter(d => d.respondent_status === 'admitted').length;
    const currentCount = filteredData.filter(d => d.respondent_status === 'current').length;
    
    // 學生類別
    const intlCount = filteredData.filter(d => d.student_category === 'international').length;
    const overseasCount = filteredData.filter(d => d.student_category === 'overseas_chinese').length;

    // 國家與區域統計
    const regions = {};
    const countries = {};
    filteredData.forEach(d => {
      regions[d.region_group] = (regions[d.region_group] || 0) + 1;
      countries[d.country_region] = (countries[d.country_region] || 0) + 1;
    });

    // 實施 5 人以下小樣本去識別化機制
    const safeRegions = {};
    Object.entries(regions).forEach(([reg, val]) => {
      if (val < 5) {
        safeRegions['Other / Merge'] = (safeRegions['Other / Merge'] || 0) + val;
      } else {
        safeRegions[reg] = val;
      }
    });

    const safeCountries = {};
    Object.entries(countries).forEach(([cCode, val]) => {
      if (val < 5) {
        safeCountries['Other / Restricted'] = (safeCountries['Other / Restricted'] || 0) + val;
      } else {
        const cObj = COUNTRIES.find(x => x.code === cCode);
        const name = cObj ? (lang === 'zh' ? cObj.zh : cObj.en) : cCode;
        safeCountries[name] = val;
      }
    });

    // 學制
    const degreeMap = { bachelor: 0, master: 0, phd: 0 };
    filteredData.forEach(d => {
      if (degreeMap[d.degree_level] !== undefined) {
        degreeMap[d.degree_level]++;
      }
    });

    // 獎學金持有比例
    let totalAdmittedWithSch = 0;
    let totalCurrentWithSch = 0;
    filteredData.forEach(d => {
      const raw = d.raw_answers || {};
      if (d.respondent_status === 'admitted' && raw.admitted_scholarship_status === 'awarded') {
        totalAdmittedWithSch++;
      } else if (d.respondent_status === 'current' && raw.current_scholarship_status === 'awarded') {
        totalCurrentWithSch++;
      }
    });

    // 最小入學門檻分佈 (Admitted)
    const thresholds = {};
    filteredData.forEach(d => {
      if (d.respondent_status === 'admitted') {
        const tVal = d.raw_answers?.admitted_minimum_threshold || 'unfilled';
        thresholds[tVal] = (thresholds[tVal] || 0) + 1;
      }
    });

    // 情境敏感度平均意願 (Admitted 7點意願平均)
    const sceneAvg = {
      scen_no_scholarship: { total: 0, count: 0 },
      scen_waiver_25: { total: 0, count: 0 },
      scen_waiver_50: { total: 0, count: 0 },
      scen_waiver_100: { total: 0, count: 0 },
      scen_allowance_only: { total: 0, count: 0 },
      scen_waiver_and_allowance: { total: 0, count: 0 },
      scen_waiver_and_housing: { total: 0, count: 0 }
    };
    filteredData.forEach(d => {
      if (d.respondent_status === 'admitted') {
        const values = d.raw_answers?.admitted_scenario_test?.values || {};
        Object.keys(sceneAvg).forEach(key => {
          if (values[key]) {
            sceneAvg[key].total += Number(values[key]);
            sceneAvg[key].count++;
          }
        });
      }
    });

    // 獎學金減少敏感度 (Current)
    const reduceAvg = {
      scen_keep_current: { total: 0, count: 0 },
      scen_reduce_25: { total: 0, count: 0 },
      scen_reduce_50: { total: 0, count: 0 },
      scen_only_waiver: { total: 0, count: 0 },
      scen_only_allowance: { total: 0, count: 0 },
      scen_stop_all: { total: 0, count: 0 }
    };
    filteredData.forEach(d => {
      if (d.respondent_status === 'current') {
        const values = d.raw_answers?.current_reduction_sensitivity?.values || {};
        Object.keys(reduceAvg).forEach(key => {
          if (values[key]) {
            reduceAvg[key].total += Number(values[key]);
            reduceAvg[key].count++;
          }
        });
      }
    });

    // 留台工作意願
    const workIntention = {};
    filteredData.forEach(d => {
      if (d.respondent_status === 'current') {
        const key = d.raw_answers?.current_intention_to_work_taiwan || 'undecided';
        workIntention[key] = (workIntention[key] || 0) + 1;
      }
    });

    // 申請障礙
    const barriers = {};
    filteredData.forEach(d => {
      if (d.respondent_status === 'current') {
        const list = d.raw_answers?.current_application_barriers || [];
        list.forEach(barr => {
          barriers[barr] = (barriers[barr] || 0) + 1;
        });
      }
    });

    return {
      total,
      admittedCount,
      currentCount,
      intlCount,
      overseasCount,
      safeRegions,
      safeCountries,
      degreeMap,
      scholarshipRatio: {
        admitted: admittedCount > 0 ? Math.round((totalAdmittedWithSch / admittedCount) * 100) : 0,
        current: currentCount > 0 ? Math.round((totalCurrentWithSch / currentCount) * 100) : 0
      },
      thresholds,
      sceneAvg: Object.entries(sceneAvg).map(([key, v]) => ({ key, avg: v.count > 0 ? (v.total / v.count).toFixed(2) : 0 })),
      reduceAvg: Object.entries(reduceAvg).map(([key, v]) => ({ key, avg: v.count > 0 ? (v.total / v.count).toFixed(2) : 0 })),
      workIntention,
      barriers: Object.entries(barriers).sort((a, b) => b[1] - a[1])
    };
  }, [filteredData, lang]);

  // 寬格式 / 長格式 CSV 檔案匯出
  const handleExportWide = () => {
    const wideData = dataService.exportWideFormat(filteredData);
    if (wideData.length === 0) return;
    
    const headers = Object.keys(wideData[0]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(",")].concat(
        wideData.map(row => headers.map(h => `"${(row[h] || "").toString().replace(/"/g, '""')}"`).join(","))
      ).join("\n");
    
    downloadFile(csvContent, "ntnu_survey_wide_format.csv");
  };

  const handleExportLong = () => {
    const longData = dataService.exportLongFormat(filteredData);
    if (longData.length === 0) return;

    const headers = Object.keys(longData[0]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(",")].concat(
        longData.map(row => headers.map(h => `"${(row[h] || "").toString().replace(/"/g, '""')}"`).join(","))
      ).join("\n");

    downloadFile(csvContent, "ntnu_survey_long_format.csv");
  };

  // 輔助下載
  const downloadFile = (content, filename) => {
    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-4 md:p-8">
      {/* 頂部標題 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-950">{t.adminTitle}</h2>
          <p className="text-xs text-slate-400 mt-1">
            當前分析總樣本：<strong>{stats.total}</strong> / 系統總計：<strong>{data.length}</strong> 筆境外學位生反饋
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <button 
            onClick={handleRegenerate}
            className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold text-xs rounded transition"
          >
            🔄 重新產生模擬數據
          </button>
          <button
            onClick={onBackToSurvey}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded transition"
          >
            ← 填寫問卷
          </button>
        </div>
      </div>

      {/* 篩選面板 */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">📍 交互分析篩選器 (Filters)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Status</label>
            <select
              value={filters.respondent_status}
              onChange={(e) => setFilters(p => ({ ...p, respondent_status: e.target.value }))}
              className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
            >
              <option value="">All Status</option>
              <option value="admitted">Admitted Student</option>
              <option value="current">Current Student</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Category</label>
            <select
              value={filters.student_category}
              onChange={(e) => setFilters(p => ({ ...p, student_category: e.target.value }))}
              className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
            >
              <option value="">All Categories</option>
              <option value="international">外國學生</option>
              <option value="overseas_chinese">僑生及港澳生</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Region</label>
            <select
              value={filters.region_group}
              onChange={(e) => setFilters(p => ({ ...p, region_group: e.target.value }))}
              className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
            >
              <option value="">All Regions</option>
              <option value="Southeast Asia">Southeast Asia</option>
              <option value="Northeast Asia">Northeast Asia</option>
              <option value="South Asia">South Asia</option>
              <option value="Europe">Europe</option>
              <option value="North America">North America</option>
              <option value="Central and South America">Central & South America</option>
              <option value="Africa">Africa</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Degree</label>
            <select
              value={filters.degree_level}
              onChange={(e) => setFilters(p => ({ ...p, degree_level: e.target.value }))}
              className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
            >
              <option value="">All Degrees</option>
              <option value="bachelor">Bachelor</option>
              <option value="master">Master</option>
              <option value="phd">PhD</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Scholarship</label>
            <select
              value={filters.scholarship_status}
              onChange={(e) => setFilters(p => ({ ...p, scholarship_status: e.target.value }))}
              className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
            >
              <option value="">All Scholar Status</option>
              <option value="awarded">Awarded (目前已獲獎)</option>
              <option value="none">None (無/未獲獎)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ respondent_status: "", student_category: "", region_group: "", degree_level: "", college: "", scholarship_status: "" })}
              className="w-full text-xs text-center border border-dashed border-slate-300 hover:border-slate-500 rounded p-1.5 text-slate-500 hover:text-slate-700 font-bold bg-white"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* 功能分頁導覽 */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${activeTab === 'summary' ? "border-red-700 text-red-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          📊 整體指標 (Overview)
        </button>
        <button
          onClick={() => setActiveTab('willingness')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${activeTab === 'willingness' ? "border-red-700 text-red-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          ⚡ 獎學金敏感度
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${activeTab === 'raw' ? "border-red-700 text-red-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          📁 數據匯出與列表
        </button>
      </div>

      {/* 分頁內容 */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* 四大核心小指標 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase">已錄取學生 / 在學生比例</div>
              <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                {stats.admittedCount} <span className="text-xs text-slate-400">/ {stats.currentCount}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Admitted vs Current</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase">外籍生 / 僑港澳生比例</div>
              <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                {stats.intlCount} <span className="text-xs text-slate-400">/ {stats.overseasCount}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Intl vs Overseas</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase">已錄取學生獎學金獲得率</div>
              <div className="text-xl md:text-2xl font-black text-emerald-600 mt-1">
                {stats.scholarshipRatio.admitted}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Awarded status</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase">在校生有領獎學金比例</div>
              <div className="text-xl md:text-2xl font-black text-emerald-600 mt-1">
                {stats.scholarshipRatio.current}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Active Scholarship Holder</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 國家別分佈 (小樣本保密原則) */}
            <div className="border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-900 text-sm mb-4">🌍 境外學生原屬國家地區分佈 (保密交叉統計)</h4>
              <div className="space-y-3">
                {Object.entries(stats.safeCountries).map(([cName, val]) => (
                  <div key={cName}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                      <span>{cName}</span>
                      <span>{val} 份 ({Math.round((val / stats.total) * 100)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-700" style={{ width: `${(val / stats.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 區域群組分佈 */}
            <div className="border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-900 text-sm mb-4">🗺️ 區域群組分佈 (Region Grouping)</h4>
              <div className="space-y-3">
                {Object.entries(stats.safeRegions).map(([reg, val]) => (
                  <div key={reg}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                      <span>{reg}</span>
                      <span>{val} 份 ({Math.round((val / stats.total) * 100)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-700" style={{ width: `${(val / stats.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'willingness' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 錄取新生情境測試平均意願 (Admitted Student) */}
            <div className="border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-900 text-sm mb-2">🎓 錄取生於各獎學金情境下的「入學意願」平均分數</h4>
              <p className="text-[10px] text-slate-400 mb-4">（1 = 一定不會入學，7 = 一定會入學）</p>
              <div className="space-y-4">
                {stats.sceneAvg.map(item => (
                  <div key={item.key}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                      <span>{item.key}</span>
                      <span className="font-bold text-red-700">{item.avg} / 7.00</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-700" style={{ width: `${(item.avg / 7) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 獎學金減少敏感度 (Current Student) */}
            <div className="border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-900 text-sm mb-2">📉 在校生獎學金「減額敏感度」與持續就讀意願平均值</h4>
              <p className="text-[10px] text-slate-400 mb-4">（1 = 完全無法繼續，7 = 一定會繼續就讀）</p>
              <div className="space-y-4">
                {stats.reduceAvg.map(item => (
                  <div key={item.key}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                      <span>{item.key}</span>
                      <span className="font-bold text-blue-700">{item.avg} / 7.00</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${(item.avg / 7) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 申請獎學金障礙統計與排名 */}
          <div className="border border-slate-200 rounded-xl p-5">
            <h4 className="font-bold text-slate-900 text-sm mb-4">⚠️ 在校生申請校內外獎學金障礙與難關排名 (Barriers Rank)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.barriers.map(([bName, val], idx) => (
                <div key={bName} className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-150 rounded-lg">
                  <span className="text-xs font-black text-slate-400 w-5">#{idx + 1}</span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-700">{bName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">累計被提：{val} 次</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'raw' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">💾 數據庫完整下載與整合分析匯出 (CSV)</h4>
              <p className="text-xs text-slate-400 mt-1">內建提供適合 Excel 精密樞紐分析的長格式 (Long-format) 與寬格式 (Wide-format) 檔案。</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={handleExportWide}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition shadow"
              >
                📥 匯出寬格式 CSV (Wide Format)
              </button>
              <button
                onClick={handleExportLong}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded transition shadow"
              >
                📥 匯出長格式 CSV (Long Format)
              </button>
            </div>
          </div>

          {/* 簡單的資料表格清單 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider">
              最新填答明細清單 (Recent Responses)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold">
                    <th className="p-3">ID</th>
                    <th className="p-3">填答時間</th>
                    <th className="p-3">身分</th>
                    <th className="p-3">類別</th>
                    <th className="p-3">國家地區</th>
                    <th className="p-3">地區分組</th>
                    <th className="p-3">學制</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 15).map(item => (
                    <tr key={item.respondent_id} className="border-b border-slate-100 hover:bg-slate-50 font-mono text-slate-600">
                      <td className="p-3 font-semibold text-slate-900">{item.respondent_id}</td>
                      <td className="p-3">{item.submitted_at?.slice(0, 16).replace('T', ' ')}</td>
                      <td className="p-3">{item.respondent_status}</td>
                      <td className="p-3">{item.student_category}</td>
                      <td className="p-3">{item.country_region}</td>
                      <td className="p-3">{item.region_group}</td>
                      <td className="p-3">{item.degree_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}