import {AnimationHandler} from "../services/animation-handler";

export class OrderSlider {
  constructor() {
    this.$arrowLeft = document.querySelector('.product-slider__arrow--left');
    this.$arrowRight = document.querySelector('.product-slider__arrow--right');
    this.$images = document.querySelector('.product-slider__images');
    this.$chosenImage = document.querySelector('.product-slider__chosen-product');
    this.$input = document.querySelector('.count-button__input');

    this.products = [];
    this.maxIDValueOfProducts = null;
    this.animationDuration = AnimationHandler.getDuration(':root', '--smoothly-anims-duration');
    this.qtySliderImages = 3;
    this.screenWidthResolution = 768; //px
    this.init();
  }

  init() {
    this.$arrowLeft.addEventListener('click', () => this.leftArrowClickHandler());
    this.$arrowRight.addEventListener('click', () => this.rightArrowClickHandler());
    this.$images.addEventListener('click', (event) => this.imageClickHandler(event));
    this.getData();
  }

  getData() {
    fetch('https://api.npoint.io/19d66b0856fad4035fb1')
        .then(response => response.json())
        .then(db_products => {
          this.products = db_products.goods;
          this.maxIDValueOfProducts = this.products.length - 1;
          this.defineNumSliderImages();
        });
  }

  defineNumSliderImages() {
    if (document.documentElement.clientWidth >= this.screenWidthResolution) {
      this.qtySliderImages = 4;
    }
    this.render();
  }

  render() {
    for (let id = 0; id < this.qtySliderImages; id++) {
      this.addImageToSlider(id, 'beforeEnd');
    }
    this.displayChosenImage(this.$images.firstElementChild);
  }

  leftArrowClickHandler() {
    this.$images.firstElementChild.classList.add('smoothlyHide');

    setTimeout(() => {
      let idOfNextBlock = this.getElemID(this.$images.lastElementChild) + 1;

      if (idOfNextBlock > this.maxIDValueOfProducts) idOfNextBlock = 0;

      this.$images.firstElementChild.remove();
      this.displayChosenImage(this.$images.firstElementChild);
      this.addImageToSlider(idOfNextBlock, 'beforeEnd');
    }, this.animationDuration);

    this.dispatchResetProductQty();
  }

  rightArrowClickHandler() {
    this.$images.lastElementChild.classList.add('smoothlyHide');

    setTimeout(() => {
      let idOfPrevBlock = this.getElemID(this.$images.firstElementChild) - 1;

      if (idOfPrevBlock < 0) idOfPrevBlock = this.maxIDValueOfProducts;

      this.$images.lastElementChild.remove();
      this.displayChosenImage(this.$images.lastElementChild);
      this.addImageToSlider(idOfPrevBlock, 'afterBegin');
    }, this.animationDuration);

    this.dispatchResetProductQty();
  }

  dispatchResetProductQty() {
    if (+this.$input.value > 0) {
      this.$input.dispatchEvent(new CustomEvent('reset-qty'));
    }
  }

  imageClickHandler(event) {
    if (event.target.tagName !== 'IMG') return false;

    this.displayChosenImage(event.target);
    this.dispatchResetProductQty();
  }

  displayChosenImage($image) {
    if (this.$chosenImage.childElementCount > 0) this.$chosenImage.firstElementChild.remove();

    const $imageClone = $image.cloneNode(true);
    $imageClone.className = 'chosen-product__img smoothlyShow';

    this.$chosenImage.insertAdjacentElement('afterBegin', $imageClone);
    this.dispatchProductData($image.getAttribute('data-id'));
  }

  getElemID(block) {
    const blockValue = block.classList.value;
    return parseInt(blockValue.match(/[0-9]/s)[0]);
  }

  addImageToSlider(id, position) {
    const elem = `<img class="product-slider__img product-img_${id}" 
                src="${this.products[id].img}"
                data-id="${id}" 
                alt="спортивное питание">`;
    this.$images.insertAdjacentHTML(position, elem);
  }

  dispatchProductData(id) {
    const productData = this.products[id];
    document.querySelector('.order__product-info')
        .dispatchEvent(new CustomEvent('get-product-id', {
          detail: {product: productData}
        }));
  }
}
















