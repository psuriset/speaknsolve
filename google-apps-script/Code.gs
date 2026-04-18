const CONFIG = {
  spreadsheetId: "153yG4z230McR_Gt51SE7rmsJ0qDYHstWXM7ZZJLfu2E",
  sheetName: "Leads",
  notificationEmail: "speaknsolveofficial@gmail.com",
  allowedOrigin: "*",
};

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const row = normalizePayload_(payload);
    appendLead_(row);
    sendNotification_(row);

    return jsonResponse_({
      ok: true,
      message: "Lead captured",
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: error.message,
    });
  }
}

function doGet() {
  const payload = eHasSubmission_(arguments[0]) ? normalizePayload_(arguments[0].parameter) : null;

  if (payload) {
    try {
      appendLead_(payload);
      sendNotification_(payload);
      return jsonResponse_({
        ok: true,
        message: "Lead captured",
      });
    } catch (error) {
      return jsonResponse_({
        ok: false,
        error: error.message,
      });
    }
  }

  return jsonResponse_({
    ok: true,
    message: "SpeakNSolve form endpoint is live",
  });
}

function eHasSubmission_(e) {
  return !!(e && e.parameter && (e.parameter.name || e.parameter.email));
}

function parsePayload_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (error) {
      // Fall back to form fields when the request is not JSON.
    }
  }

  return e && e.parameter ? e.parameter : {};
}

function normalizePayload_(payload) {
  return {
    submittedAt: payload.submittedAt || new Date().toISOString(),
    source: payload.source || "unknown",
    name: payload.name || "",
    email: payload.email || "",
    grade: payload.grade || "",
    interests: payload.interests || "",
    notes: payload.notes || "",
  };
}

function appendLead_(lead) {
  const sheet = getOrCreateSheet_();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At",
      "Source",
      "Name",
      "Email",
      "Student Age Or Grade",
      "Student Interests",
      "Notes",
    ]);
  }

  sheet.appendRow([
    lead.submittedAt,
    lead.source,
    lead.name,
    lead.email,
    lead.grade,
    lead.interests,
    lead.notes,
  ]);
}

function getOrCreateSheet_() {
  const spreadsheet = CONFIG.spreadsheetId
    ? SpreadsheetApp.openById(CONFIG.spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.sheetName);
  }

  return sheet;
}

function sendNotification_(lead) {
  if (!CONFIG.notificationEmail) {
    return;
  }

  const subject = "New SpeakNSolve pilot request";
  const body = [
    "A new pilot request was submitted.",
    "",
    "Name: " + lead.name,
    "Email: " + lead.email,
    "Student Age Or Grade: " + lead.grade,
    "Student Interests: " + lead.interests,
    "Notes: " + lead.notes,
    "Source: " + lead.source,
    "Submitted At: " + lead.submittedAt,
  ].join("\n");

  MailApp.sendEmail(CONFIG.notificationEmail, subject, body);
}

function jsonResponse_(payload) {
  const output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
