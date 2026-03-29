// ============================================
// Google Apps Script — Big Era 4 Email Backend
// ============================================
//
// SETUP INSTRUCTIONS (see SETUP_INSTRUCTIONS.md for step-by-step):
// 1. Go to https://script.google.com while logged into paul.strootman@gmail.com
// 2. Create a new project
// 3. Paste this entire code into the editor
// 4. Click Deploy > New deployment > Web app
// 5. Set "Execute as: Me" and "Who has access: Anyone"
// 6. Copy the deployment URL
// 7. Replace GOOGLE_APPS_SCRIPT_URL in index.html with that URL
//

// Teacher email mapping — students never see these addresses
var TEACHER_EMAILS = {
  "Ms. Singh": "psingh@asdubai.org",
  "Mr. Ghammoh": "ggammoh@asdubai.org",
  "Mr. Strootman": "pstrootman@asdubai.org"
};

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var studentName = data.studentName || "Unknown Student";
    var teacherName = data.teacherName || "Unknown Teacher";
    var section = data.section || "Unknown Section";
    var lessonName = data.lessonName || "Big Era 4 Lesson 1";
    var responses = data.responses || {};

    // Get teacher email
    var teacherEmail = TEACHER_EMAILS[teacherName];
    if (!teacherEmail) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Unknown teacher: " + teacherName }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Build email subject: Section — Student Name — Teacher Name — Lesson
    var subject = section + " — " + studentName + " — " + teacherName + " — " + lessonName;

    // Build formatted HTML email body
    var htmlBody = buildEmailHTML(studentName, teacherName, section, lessonName, responses);
    var plainBody = buildEmailPlain(studentName, teacherName, section, lessonName, responses);

    // Send email to teacher's school address
    GmailApp.sendEmail(teacherEmail, subject, plainBody, {
      htmlBody: htmlBody,
      name: "Big Era 4 - Student Submission",
      replyTo: "noreply@example.com"
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Work submitted successfully!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Big Era 4 email backend is running." }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===========================
// HTML Email Builder
// ===========================
function buildEmailHTML(studentName, teacherName, section, lessonName, responses) {
  var html = '';
  html += '<!DOCTYPE html><html><head><style>';
  html += 'body { font-family: Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }';
  html += 'h1 { color: #1a3a5c; border-bottom: 3px solid #c8a951; padding-bottom: 10px; }';
  html += 'h2 { color: #1a3a5c; margin-top: 30px; }';
  html += 'h3 { color: #4a3728; margin-top: 20px; }';
  html += '.header-info { background: #f5f0e1; padding: 15px; border-radius: 8px; margin-bottom: 20px; }';
  html += '.header-info p { margin: 5px 0; }';
  html += '.level-section { border-left: 4px solid #ccc; padding-left: 15px; margin: 20px 0; }';
  html += '.level-1 { border-color: #cd7f32; }';
  html += '.level-2 { border-color: #8a9ea7; }';
  html += '.level-3 { border-color: #c8a951; }';
  html += '.level-4 { border-color: #1a3a5c; }';
  html += '.activity { background: #fafafa; padding: 12px; border-radius: 6px; margin: 10px 0; }';
  html += '.score { font-weight: bold; color: #2a7d2a; }';
  html += '.response-text { background: #fff; border: 1px solid #ddd; padding: 10px; border-radius: 4px; margin: 5px 0; white-space: pre-wrap; }';
  html += '.label { font-weight: bold; color: #555; }';
  html += '</style></head><body>';

  // Header
  html += '<h1>Big Era 4 — Lesson 1: Student Submission</h1>';
  html += '<div class="header-info">';
  html += '<p><strong>Student:</strong> ' + escapeHtml(studentName) + '</p>';
  html += '<p><strong>Teacher:</strong> ' + escapeHtml(teacherName) + '</p>';
  html += '<p><strong>Section:</strong> ' + escapeHtml(section) + '</p>';
  html += '<p><strong>Lesson:</strong> ' + escapeHtml(lessonName) + '</p>';
  html += '<p><strong>Submitted:</strong> ' + new Date().toLocaleString("en-US", {timeZone: "Asia/Dubai"}) + ' (Dubai Time)</p>';
  html += '</div>';

  // Level 1
  html += '<div class="level-section level-1">';
  html += '<h2>Level 1: Knowledge Recall</h2>';

  if (responses.level1) {
    var l1 = responses.level1;

    html += '<div class="activity">';
    html += '<h3>1.1 Vocabulary Matching</h3>';
    if (l1.vocabMatching) {
      html += '<p class="score">Score: ' + (l1.vocabMatching.score || 'Not completed') + '</p>';
      if (l1.vocabMatching.matches) {
        html += '<ul>';
        for (var term in l1.vocabMatching.matches) {
          html += '<li><strong>' + escapeHtml(term) + '</strong> → ' + escapeHtml(l1.vocabMatching.matches[term]) + '</li>';
        }
        html += '</ul>';
      }
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';

    html += '<div class="activity">';
    html += '<h3>1.2 Timeline Sorting</h3>';
    if (l1.timelineSorting) {
      html += '<p class="score">Score: ' + (l1.timelineSorting.score || 'Not completed') + '</p>';
      if (l1.timelineSorting.order) {
        html += '<ol>';
        for (var i = 0; i < l1.timelineSorting.order.length; i++) {
          html += '<li>' + escapeHtml(l1.timelineSorting.order[i]) + '</li>';
        }
        html += '</ol>';
      }
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';

    html += '<div class="activity">';
    html += '<h3>1.3 Population Fill-in-the-Blank</h3>';
    if (l1.fillInBlank) {
      html += '<p class="score">Score: ' + (l1.fillInBlank.score || 'Not completed') + '</p>';
      if (l1.fillInBlank.answers) {
        html += '<ul>';
        for (var j = 0; j < l1.fillInBlank.answers.length; j++) {
          html += '<li>' + escapeHtml(l1.fillInBlank.answers[j]) + '</li>';
        }
        html += '</ul>';
      }
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';

    html += '<div class="activity">';
    html += '<h3>1.4 Empire-City Matching</h3>';
    if (l1.cityMatching) {
      html += '<p class="score">Score: ' + (l1.cityMatching.score || 'Not completed') + '</p>';
      if (l1.cityMatching.matches) {
        html += '<ul>';
        for (var city in l1.cityMatching.matches) {
          html += '<li><strong>' + escapeHtml(city) + '</strong> → ' + escapeHtml(l1.cityMatching.matches[city]) + '</li>';
        }
        html += '</ul>';
      }
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';
  }
  html += '</div>';

  // Level 2
  html += '<div class="level-section level-2">';
  html += '<h2>Level 2: Explain & Apply</h2>';

  if (responses.level2) {
    var l2 = responses.level2;

    html += '<div class="activity">';
    html += '<h3>2.1 Cause-and-Effect Chain</h3>';
    if (l2.causeEffect) {
      html += '<p class="score">Score: ' + (l2.causeEffect.score || 'Not completed') + '</p>';
      if (l2.causeEffect.order) {
        html += '<ol>';
        for (var k = 0; k < l2.causeEffect.order.length; k++) {
          html += '<li>' + escapeHtml(l2.causeEffect.order[k]) + '</li>';
        }
        html += '</ol>';
      }
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';

    html += '<div class="activity">';
    html += '<h3>2.2 Explain It — Written Responses</h3>';
    if (l2.explainIt) {
      for (var q = 0; q < l2.explainIt.length; q++) {
        var resp = l2.explainIt[q];
        html += '<div class="response-text">';
        html += '<p class="label">Prompt ' + (q + 1) + ':</p>';
        html += '<p>' + escapeHtml(resp.prompt || '') + '</p>';
        html += '<p class="label">Response (' + (resp.wordCount || 0) + ' words):</p>';
        html += '<p>' + escapeHtml(resp.response || 'No response') + '</p>';
        html += '</div>';
      }
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';

    html += '<div class="activity">';
    html += '<h3>2.3 Trade Goods Categorization</h3>';
    if (l2.tradeGoods) {
      html += '<p class="score">Score: ' + (l2.tradeGoods.score || 'Not completed') + '</p>';
      if (l2.tradeGoods.categories) {
        for (var cat in l2.tradeGoods.categories) {
          html += '<p><strong>' + escapeHtml(cat) + ':</strong> ' + escapeHtml(l2.tradeGoods.categories[cat].join(', ')) + '</p>';
        }
      }
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';
  }
  html += '</div>';

  // Level 3
  html += '<div class="level-section level-3">';
  html += '<h2>Level 3: Analyze with Evidence</h2>';

  if (responses.level3) {
    var l3 = responses.level3;

    html += '<div class="activity">';
    html += '<h3>3.1 Consequences Analysis</h3>';
    if (l3.consequences) {
      html += '<p class="score">Sorting Score: ' + (l3.consequences.score || 'Not completed') + '</p>';
      if (l3.consequences.positive) {
        html += '<p><strong>Positive:</strong> ' + escapeHtml(l3.consequences.positive.join(', ')) + '</p>';
      }
      if (l3.consequences.negative) {
        html += '<p><strong>Negative:</strong> ' + escapeHtml(l3.consequences.negative.join(', ')) + '</p>';
      }
      if (l3.consequences.positiveExplanation) {
        html += '<div class="response-text"><p class="label">Why positive consequences were beneficial:</p>';
        html += '<p>' + escapeHtml(l3.consequences.positiveExplanation) + '</p></div>';
      }
      if (l3.consequences.negativeExplanation) {
        html += '<div class="response-text"><p class="label">Why negative consequences were harmful:</p>';
        html += '<p>' + escapeHtml(l3.consequences.negativeExplanation) + '</p></div>';
      }
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';

    html += '<div class="activity">';
    html += '<h3>3.2 Claim-Evidence-Reasoning</h3>';
    if (l3.cer) {
      html += '<div class="response-text"><p class="label">Claim:</p>';
      html += '<p>' + escapeHtml(l3.cer.claim || 'No response') + '</p></div>';
      html += '<div class="response-text"><p class="label">Evidence:</p>';
      html += '<p>' + escapeHtml(l3.cer.evidence || 'No response') + '</p></div>';
      html += '<div class="response-text"><p class="label">Reasoning:</p>';
      html += '<p>' + escapeHtml(l3.cer.reasoning || 'No response') + '</p></div>';
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';

  }
  html += '</div>';

  // Level 4
  html += '<div class="level-section level-4">';
  html += '<h2>Level 4: Connect & Create</h2>';

  if (responses.level4) {
    var l4 = responses.level4;

    html += '<div class="activity">';
    html += '<h3>4.1 "Our Big Era" — Modern Parallel Essay</h3>';
    if (l4.modernEssay) {
      html += '<div class="response-text">';
      html += '<p class="label">Response (' + (l4.modernEssay.wordCount || 0) + ' words):</p>';
      html += '<p>' + escapeHtml(l4.modernEssay.response || 'No response') + '</p>';
      html += '</div>';
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';

    html += '<div class="activity">';
    html += '<h3>4.2 Synectics — "Big Era IV Is Like a ___"</h3>';
    if (l4.synectics && l4.synectics.length > 0) {
      for (var s = 0; s < l4.synectics.length; s++) {
        var syn = l4.synectics[s];
        html += '<div class="response-text">';
        html += '<p class="label">"Big Era IV is like a ' + escapeHtml(syn.object || '?') + ' because..."</p>';
        html += '<p>(' + (syn.wordCount || 0) + ' words): ' + escapeHtml(syn.response || 'No response') + '</p>';
        html += '</div>';
      }
    } else { html += '<p><em>Not completed</em></p>'; }
    html += '</div>';
  }
  html += '</div>';

  html += '<hr><p style="color:#999; font-size:12px;">This submission was generated automatically from the Big Era 4 interactive lesson page.</p>';
  html += '</body></html>';

  return html;
}

// ===========================
// Plain Text Email Builder (fallback)
// ===========================
function buildEmailPlain(studentName, teacherName, section, lessonName, responses) {
  var text = '';
  text += 'BIG ERA 4 — LESSON 1: STUDENT SUBMISSION\n';
  text += '==========================================\n\n';
  text += 'Student: ' + studentName + '\n';
  text += 'Teacher: ' + teacherName + '\n';
  text += 'Section: ' + section + '\n';
  text += 'Lesson: ' + lessonName + '\n';
  text += 'Submitted: ' + new Date().toLocaleString("en-US", {timeZone: "Asia/Dubai"}) + ' (Dubai Time)\n\n';
  text += JSON.stringify(responses, null, 2);
  return text;
}

function escapeHtml(text) {
  if (!text) return '';
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
