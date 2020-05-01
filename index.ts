const fullSizeImageContainer: HTMLElement = document.querySelector(
	'.magnifier__full-size'
);
const miniatureContainer: HTMLElement = document.querySelector(
	'.magnifier__miniature'
);
const miniatureImage: HTMLElement = miniatureContainer.querySelector(
	'.magnifier__miniature img'
);

class Magnifier {
	public fullSizeImage: HTMLElement;
	constructor(
		public readonly fullSizeContainer: HTMLElement,
		public readonly miniatureImage: HTMLElement
	) {
		this.miniatureImage.addEventListener(
			'mousemove',
			this.moveMagnifier.bind(this)
		);
		this.fullSizeImage = this.fullSizeContainer.querySelector('img');
	}

	private getRelativeMousePosition($event: MouseEvent) {
		const target = $event.target as HTMLElement;
		const bounding = target.getBoundingClientRect();
		const x = $event.pageX - bounding.left;
		const y = $event.pageY - bounding.top;
		return { x, y };
	}

	private moveMagnifier($event: MouseEvent) {
		// Calculate mouse position relative to parent, not window.
		const { x, y } = this.getRelativeMousePosition($event);
		const containerBounding = this.fullSizeContainer.getBoundingClientRect();

		// How many full size container is bigger than miniature container.
		const scale = Math.sqrt(
			(this.fullSizeImage.clientWidth * this.fullSizeImage.clientHeight) /
				(this.miniatureImage.clientWidth * this.miniatureImage.clientHeight)
		);

		// How far to move image relative to miniature.
		const vector = {
			x: -x * scale + containerBounding.width / 2,
			y: -y * scale + containerBounding.height / 2,
		};

		// Check if image doesn't leave empty spaces in X-axis.
		const canMoveXAxis =
			this.fullSizeImage.getBoundingClientRect().width + vector.x >
				containerBounding.width && vector.x < 0;

		// Check if image doesn't leave empty spaces in Y-axis.
		const canMoveYAxis =
			this.fullSizeImage.getBoundingClientRect().height + vector.y >
				containerBounding.height && vector.y < 0;

		if (canMoveYAxis)
			this.fullSizeImage.style.setProperty('top', `${vector.y}px`);
		if (canMoveXAxis)
			this.fullSizeImage.style.setProperty('left', `${vector.x}px`);
	}
}

let magnifier = new Magnifier(fullSizeImageContainer, miniatureImage);
