document.addEventListener("DOMContentLoaded", async () => {
    startTransition();
    await preloadThumbnails();
});

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("video-popup");
    const popupVideo = document.getElementById("popup-video");

    window.openPopup = function (videoSrc) {
        popupVideo.src = videoSrc;
        popup.style.display = "flex";
        popupVideo.play();
    };

    window.closePopup = function () {
        popup.style.display = "none";
        popupVideo.pause();
        popupVideo.src = "";
    };

    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    document.querySelectorAll(".thumbnail-video").forEach(video => {
        video.addEventListener("click", function () {
            openPopup(video.src || video.querySelector("source").src);
        });
    });
});

function startTransition() {
    const cloudLeft = document.querySelector(".cloud-left");
    const cloudRight = document.querySelector(".cloud-right");

    if (cloudLeft) cloudLeft.classList.add("animate-left");
    if (cloudRight) cloudRight.classList.add("animate-right");
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".video-grid video").forEach(video => {
        video.addEventListener("click", function () {
            openPopup(video.src || video.querySelector("source").src);
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".video-thumbnail").forEach(video => {
        video.addEventListener("mouseenter", () => video.play());
        video.addEventListener("mouseleave", () => {
            video.pause();
            video.currentTime = 0;
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const shortsModal = document.getElementById("shorts-modal");
    const shortsVideo = document.getElementById("shorts-video");
    const shortsVideos = [
        "https://videos.pexels.com/video-files/7975481/7975481-hd_1080_1920_30fps.mp4",
        "https://videos.pexels.com/video-files/7975481/7975481-hd_1080_1920_30fps.mp4"
    ];
    let currentShortIndex = 0;
    const body = document.body;

    window.openShorts = function () {
        shortsModal.style.display = "flex";
        body.classList.add("blackout-background");
        body.style.overflow = "hidden";
        loadShort(currentShortIndex);
    };

    function loadShort(index) {
        shortsVideo.src = shortsVideos[index];
        shortsVideo.style.opacity = 0;
        setTimeout(() => {
            shortsVideo.style.opacity = 1;
        }, 300);
        shortsVideo.play();
    }

    window.closeShorts = function () {
        shortsModal.style.display = "none";
        shortsVideo.pause();
        shortsVideo.currentTime = 0;
        body.classList.remove("blackout-background");
        body.style.overflow = "auto";
    };

    document.addEventListener("keydown", (e) => {
        if (shortsModal.style.display === "flex") {
            if (e.key === "ArrowUp") {
                currentShortIndex = (currentShortIndex > 0) ? currentShortIndex - 1 : shortsVideos.length - 1;
            } else if (e.key === "ArrowDown") {
                currentShortIndex = (currentShortIndex < shortsVideos.length - 1) ? currentShortIndex + 1 : 0;
            }
            loadShort(currentShortIndex);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && shortsModal.style.display === "flex") {
            closeShorts();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (shortsModal.style.display === "flex" && e.code === "Space") {
            e.preventDefault();
            toggleShortsPlayback();
        }
    });

    shortsVideo.addEventListener("click", toggleShortsPlayback);

    function toggleShortsPlayback() {
        if (shortsVideo.paused) {
            shortsVideo.play();
        } else {
            shortsVideo.pause();
        }
    }

    shortsModal.addEventListener("click", (e) => {
        if (e.target === shortsModal) {
            closeShorts();
        }
    });
});

document.querySelectorAll(".video-wrapper").forEach(wrapper => {
    const thumbnailImg = wrapper.querySelector(".video-thumbnail-img");
    const video = wrapper.querySelector(".video-thumbnail");

    thumbnailImg.addEventListener("click", function () {
        thumbnailImg.style.display = "none"; 
        video.style.display = "block";
        video.play();
    });

    video.addEventListener("loadeddata", function () {
        if (!thumbnailImg.src || thumbnailImg.src.includes("default-thumbnail.jpg")) {
            captureFirstFrame(video);
        }
    });
});

function captureFirstFrame(video) {
    return new Promise((resolve) => {
        if (video.readyState >= 2) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const posterData = canvas.toDataURL("image/png");

            const thumbnailImg = video.previousElementSibling;
            if (thumbnailImg && thumbnailImg.tagName === "IMG") {
                thumbnailImg.src = posterData;
            }
            resolve();
        } else {
            setTimeout(() => resolve(captureFirstFrame(video)), 100);
        }
    });
}

async function preloadThumbnails() {
    const videos = document.querySelectorAll(".video-thumbnail");

    for (const video of videos) {
        video.preload = "auto";

        await new Promise((resolve) => {
            video.addEventListener("loadedmetadata", async function () {
                video.currentTime = 0.1;
                video.muted = true;
                video.play();

                setTimeout(async () => {
                    await captureFirstFrame(video);
                    video.pause();
                    video.currentTime = 0;
                    resolve();
                }, 300);
            });

            video.load();
        });
    }
}