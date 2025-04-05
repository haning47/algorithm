
window.addEventListener('DOMContentLoaded', () => {
  // Hide download and print buttons
  const downloadBtn = document.getElementById('download');
  const printBtn = document.getElementById('print');
  if (downloadBtn) downloadBtn.style.display = 'none';
  if (printBtn) printBtn.style.display = 'none';
});
