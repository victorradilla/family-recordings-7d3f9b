const tracks = Array.from({ length: 16 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    number,
    title: index === 15 ? "Track 16 — partial recovery" : `Track ${number}`,
    src: `audio/track-${number}.mp3`
  };
});

const audio = document.querySelector("#audio-player");
const playlist = document.querySelector("#playlist");
const currentNumber = document.querySelector("#current-number");
const currentTitle = document.querySelector("#current-title");
let currentIndex = 0;

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function renderPlaylist() {
  playlist.innerHTML = tracks.map((track, index) => `
    <li>
      <button class="track-button" type="button" data-index="${index}" aria-current="${index === currentIndex}">
        <span class="track-number">${track.number}</span>
        <span class="track-title">${track.title}</span>
        <span class="track-duration" data-duration="${index}"></span>
      </button>
    </li>`).join("");
}

function selectTrack(index, autoplay = true) {
  currentIndex = index;
  const track = tracks[index];
  audio.src = track.src;
  currentNumber.textContent = track.number;
  currentTitle.textContent = track.title;
  playlist.querySelectorAll(".track-button").forEach((button, buttonIndex) => {
    button.setAttribute("aria-current", String(buttonIndex === index));
  });
  if (autoplay) audio.play().catch(() => {});
}

renderPlaylist();

playlist.addEventListener("click", event => {
  const button = event.target.closest(".track-button");
  if (button) selectTrack(Number(button.dataset.index));
});

audio.addEventListener("ended", () => {
  if (currentIndex < tracks.length - 1) selectTrack(currentIndex + 1);
});

tracks.forEach((track, index) => {
  const probe = new Audio();
  probe.preload = "metadata";
  probe.src = track.src;
  probe.addEventListener("loadedmetadata", () => {
    const duration = document.querySelector(`[data-duration="${index}"]`);
    if (duration) duration.textContent = formatDuration(probe.duration);
    probe.src = "";
  }, { once: true });
});
