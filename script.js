const initSlider = () => {
  const imageList = document.querySelector(".slider-wrapper .image-list");
  const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
  const sliderScrollbar = document.querySelector(".container .slider-scrollbar");
  const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");

  // Get max scrollable area
  const getMaxScrollLeft = () => {
    return imageList.scrollWidth - imageList.clientWidth;
  };

  let maxScrollLeft = getMaxScrollLeft();

  // handle scrollbar thumb drag 
  scrollbarThumb.addEventListener("mousedown", (e) => {
    const startX = e.clientX;
    const thumbPosition = scrollbarThumb.offsetLeft;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      let newThumbPosition = thumbPosition + deltaX;

      const maxThumbPosition = sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth;
      newThumbPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));  // Make sure the thumb stays within bounds

      // Calculate the scroll position based on the thumb's position
      const scrollPosition = (newThumbPosition / maxThumbPosition) * maxScrollLeft;
      
      console.log('newThumbPosition', newThumbPosition, 'scrollPosition', scrollPosition);  // Debugging logs

      scrollbarThumb.style.left = `${newThumbPosition}px`;
      imageList.scrollLeft = scrollPosition;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Attach mousemove and mouseup event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });

  // slide images according to the slide button clicks
  slideButtons.forEach(button => {
    button.addEventListener("click", () => {
      const direction = button.id === "prev-slide" ? -1 : 1;
      const scrollAmount = imageList.clientWidth * direction;
      imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  });

  // handle visibility of the slide buttons
  const handleSlideButtons = () => {
    slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "block";
    slideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "block";
  };

  // update scrollbar thumb position based on image scroll
  const updateScrollThumbPosition = () => {
    const scrollPosition = imageList.scrollLeft;
    const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
    scrollbarThumb.style.left = `${thumbPosition}px`;
  };

  imageList.addEventListener("scroll", () => {
    maxScrollLeft = getMaxScrollLeft();  // Recalculate maxScrollLeft in case the content changes dynamically
    handleSlideButtons();
    updateScrollThumbPosition();
  });
};

window.addEventListener("load", initSlider);
