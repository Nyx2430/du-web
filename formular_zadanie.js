document.addEventListener('DOMContentLoaded', () => {
  const courseForm = document.getElementById('course-form');
  if (!courseForm) {
    return;
  }

  const fullName = document.getElementById('full-name');
  const email = document.getElementById('email');
  const course = document.getElementById('course');
  const note = document.getElementById('note');
  const previewName = document.getElementById('preview-name');
  const previewEmail = document.getElementById('preview-email');
  const previewCourse = document.getElementById('preview-course');
  const previewLevel = document.getElementById('preview-level');
  const previewNote = document.getElementById('preview-note');
  const previewAvatar = document.getElementById('preview-avatar');
  const formPanel = document.getElementById('form-panel');

  const updatePreview = () => {
    const name = fullName.value.trim();
    previewName.textContent = name || 'Tvoje meno';
    previewEmail.textContent = email.value.trim() || 'tvoj@email.sk';
    previewCourse.textContent = course.value;
    previewLevel.textContent = courseForm.querySelector('input[name="level"]:checked').value;
    previewNote.textContent = note.value.trim() || 'Tvoja poznámka sa zobrazí tu...';
    previewAvatar.textContent = name ? name.charAt(0).toLocaleUpperCase('sk-SK') : '?';
  };

  [fullName, email, course, note].forEach((field) => {
    field.addEventListener('input', updatePreview);
    field.addEventListener('change', updatePreview);
  });
  courseForm.querySelectorAll('input[name="level"]').forEach((radio) => {
    radio.addEventListener('change', updatePreview);
  });

  courseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formPanel.hidden = true;
    window.alert('Formulár bol úspešne odoslaný.');
  });

  updatePreview();
});
