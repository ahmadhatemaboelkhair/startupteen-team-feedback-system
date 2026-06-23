const CONFIG = {
  spreadsheetName: "StartupTeen Team Feedback Responses",
  sheetName: "Submissions",
  schoolsSheetName: "Schools",
  driveFolderName: "StartupTeen Feedback Uploads",
  fileSharing: "PRIVATE" // Use "ANYONE_WITH_LINK" only if your organization approves link sharing.
};

const DEFAULT_SCHOOLS = [
  "iSchool Maadi",
  "iSchool Nasr City",
  "iSchool 6th of October",
  "iSchool Alexandria",
  "iSchool Mansoura"
];

const ALL_CHECKLIST_ITEMS = [
  "Problem Statement",
  "Positioning Statement",
  "Value Proposition",
  "Business Model Canvas",
  "Marketing Plan",
  "Plan the 4 Ps",
  "Brand Mantra",
  "Revisit Your Solution",
  "Validate Your Segment",
  "Compare With Competitors",
  "Revisit Your Business",
  "Tune Your Marketing Strategy",
  "4Ps Alignment Check",
  "AI-Powered Wireframing",
  "Visual Blueprint Of Product",
  "Startup Logo",
  "AI Content Calendar",
  "Product Visual Identity",
  "Color Harmony Check",
  "Find Your Visual Voice",
  "Spot Early Adopters",
  "AI Generated Ad Mockup",
  "Prepare Response Plan",
  "Trace User Flow",
  "Start Testing",
  "Pitching Your Idea",
  "Pitch Deck",
  "Practice Your Pitch",
  "Final Fixes",
  "Final Demo"
];

const BASE_HEADERS = [
  "Timestamp",
  "Submission ID",
  "Tutor ID",
  "Tutor Name",
  "School",
  "Group ID",
  "Team Name",
  "Members Count",
  "Session Date",
  "Session Number"
];

const SCORE_HEADERS = [
  "Presentation Score",
  "Idea Score",
  "Technicality Score",
  "Collaboration Score",
  "Attendance Score",
  "Creativity Score",
  "Progress Score"
];

const FINAL_HEADERS = [
  "Feedback Text",
  "Uploaded File URL",
  "Recommendation",
  "Additional Notes"
];

function setupFeedbackSystem() {
  const sheet = ensureSheet_();
  ensureSchoolsSheet_();
  const folder = ensureFolder_();
  return {
    spreadsheetUrl: sheet.getParent().getUrl(),
    driveFolderUrl: folder.getUrl(),
    message: "StartupTeen feedback system is ready."
  };
}

function doGet() {
  return json_({
    ok: true,
    app: "StartupTeen Team Feedback System",
    message: "Apps Script endpoint is live. Use POST requests from the Next.js application."
  });
}

function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents || "{}");
    assertToken_(request.token);

    if (request.action === "submitFeedback") {
      return json_(submitFeedback_(request.payload));
    }

    if (request.action === "listSubmissions") {
      return json_(listSubmissions_());
    }

    if (request.action === "listSchools") {
      return json_(listSchools_());
    }

    if (request.action === "addSchool") {
      return json_(addSchool_(request.payload));
    }

    throw new Error("Unknown action: " + request.action);
  } catch (error) {
    return json_({ ok: false, error: error.message || String(error) });
  }
}

function submitFeedback_(payload) {
  if (!payload || !payload.submission) {
    throw new Error("Missing submission payload.");
  }

  const sheet = ensureSheet_();
  const submission = payload.submission;
  const uploadedFileUrl = payload.uploadedFile ? saveUploadedFile_(payload.submissionId, payload.uploadedFile) : "";
  const checklistMap = {};

  (submission.checklist || []).forEach(function (entry) {
    checklistMap[entry.item] = entry;
  });

  const row = [
    new Date(),
    payload.submissionId,
    submission.tutorId,
    submission.tutorName,
    submission.school,
    submission.groupId,
    submission.teamName,
    submission.membersCount,
    submission.sessionDate,
    submission.sessionNumber
  ];

  ALL_CHECKLIST_ITEMS.forEach(function (item) {
    const entry = checklistMap[item] || {};
    row.push(entry.completed || "");
    row.push(entry.notes || "");
  });

  row.push(
    submission.scores.presentation,
    submission.scores.idea,
    submission.scores.technicality,
    submission.scores.collaboration,
    submission.scores.attendance,
    submission.scores.creativity,
    submission.scores.progress,
    submission.feedbackText || "",
    uploadedFileUrl,
    submission.recommendation,
    submission.additionalNotes || ""
  );

  sheet.appendRow(row);

  return {
    ok: true,
    submissionId: payload.submissionId,
    uploadedFileUrl: uploadedFileUrl
  };
}

function listSubmissions_() {
  const sheet = ensureSheet_();
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return { ok: true, submissions: [] };
  }

  const headers = values[0];
  const submissions = values.slice(1).reverse().map(function (row) {
    const record = {};
    headers.forEach(function (header, index) {
      record[header] = row[index];
    });

    const checklist = {};
    ALL_CHECKLIST_ITEMS.forEach(function (item) {
      checklist[item] = {
        completed: record[item + " Completed"] || "",
        notes: record[item + " Notes"] || ""
      };
    });

    return {
      timestamp: formatDate_(record["Timestamp"]),
      submissionId: record["Submission ID"] || "",
      tutorId: record["Tutor ID"] || "",
      tutorName: record["Tutor Name"] || "",
      school: record["School"] || "",
      groupId: record["Group ID"] || "",
      teamName: record["Team Name"] || "",
      membersCount: Number(record["Members Count"] || 0),
      sessionDate: formatPlainDate_(record["Session Date"]),
      sessionNumber: record["Session Number"] || "",
      presentationScore: Number(record["Presentation Score"] || 0),
      ideaScore: Number(record["Idea Score"] || 0),
      technicalityScore: Number(record["Technicality Score"] || 0),
      collaborationScore: Number(record["Collaboration Score"] || 0),
      attendanceScore: Number(record["Attendance Score"] || 0),
      creativityScore: Number(record["Creativity Score"] || 0),
      progressScore: Number(record["Progress Score"] || 0),
      feedbackText: record["Feedback Text"] || "",
      uploadedFileUrl: record["Uploaded File URL"] || "",
      recommendation: record["Recommendation"] || "",
      additionalNotes: record["Additional Notes"] || "",
      checklist: checklist
    };
  });

  return { ok: true, submissions: submissions };
}

function listSchools_() {
  const sheet = ensureSchoolsSheet_();
  const values = sheet.getDataRange().getValues();
  const schools = values
    .slice(1)
    .map(function (row) {
      return String(row[0] || "").trim();
    })
    .filter(Boolean);

  return { ok: true, schools: schools };
}

function addSchool_(payload) {
  const schoolName = String((payload && payload.schoolName) || "").trim();
  if (!schoolName) {
    throw new Error("School name is required.");
  }

  const sheet = ensureSchoolsSheet_();
  const existing = listSchools_().schools;
  const duplicate = existing.some(function (school) {
    return school.toLowerCase() === schoolName.toLowerCase();
  });

  if (duplicate) {
    throw new Error("This school already exists.");
  }

  sheet.appendRow([schoolName, new Date()]);
  return listSchools_();
}

function ensureSheet_() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  let spreadsheet;

  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create(CONFIG.spreadsheetName);
    properties.setProperty("SPREADSHEET_ID", spreadsheet.getId());
  }

  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.sheetName);
  }

  const headers = buildHeaders_();
  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0];
  const needsHeaders = headers.some(function (header, index) {
    return currentHeaders[index] !== header;
  });

  if (needsHeaders) {
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#ff7a1a").setFontColor("#ffffff");
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

function ensureSchoolsSheet_() {
  const submissionSheet = ensureSheet_();
  const spreadsheet = submissionSheet.getParent();
  let sheet = spreadsheet.getSheetByName(CONFIG.schoolsSheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.schoolsSheetName);
  }

  const headers = ["School", "Created At"];
  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0];
  const needsHeaders = headers.some(function (header, index) {
    return currentHeaders[index] !== header;
  });

  if (needsHeaders) {
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#056FEC").setFontColor("#ffffff");
  }

  if (sheet.getLastRow() === 1) {
    DEFAULT_SCHOOLS.forEach(function (school) {
      sheet.appendRow([school, new Date()]);
    });
  }

  sheet.autoResizeColumns(1, headers.length);
  return sheet;
}

function ensureFolder_() {
  const properties = PropertiesService.getScriptProperties();
  let folderId = properties.getProperty("DRIVE_FOLDER_ID");

  if (folderId) {
    return DriveApp.getFolderById(folderId);
  }

  const folder = DriveApp.createFolder(CONFIG.driveFolderName);
  properties.setProperty("DRIVE_FOLDER_ID", folder.getId());
  return folder;
}

function saveUploadedFile_(submissionId, uploadedFile) {
  const folder = ensureFolder_();
  const bytes = Utilities.base64Decode(uploadedFile.data);
  const safeName = submissionId + " - " + uploadedFile.name;
  const blob = Utilities.newBlob(bytes, uploadedFile.mimeType, safeName);
  const file = folder.createFile(blob);

  if (CONFIG.fileSharing === "ANYONE_WITH_LINK") {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  return file.getUrl();
}

function buildHeaders_() {
  const checklistHeaders = [];
  ALL_CHECKLIST_ITEMS.forEach(function (item) {
    checklistHeaders.push(item + " Completed");
    checklistHeaders.push(item + " Notes");
  });
  return BASE_HEADERS.concat(checklistHeaders, SCORE_HEADERS, FINAL_HEADERS);
}

function assertToken_(token) {
  const expected = PropertiesService.getScriptProperties().getProperty("API_TOKEN");
  if (!expected) {
    throw new Error("API_TOKEN is not set in Apps Script properties.");
  }
  if (token !== expected) {
    throw new Error("Invalid API token.");
  }
}

function formatDate_(value) {
  if (!value) {
    return "";
  }
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  }
  return String(value);
}

function formatPlainDate_(value) {
  if (!value) {
    return "";
  }
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(value);
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
