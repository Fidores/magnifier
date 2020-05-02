const fullSizeImageContainer: HTMLElement = document.querySelector(
	'.magnifier__full-size'
);

interface Miniature {
	ref: HTMLElement;
	fullSizeImage: string;
}

class Magnifier {
	constructor(
		public readonly fullSizeContainer: HTMLElement,
		public readonly miniatures: Miniature[]
	) {
		this.currentMiniature = miniatures[0];
		this.fullSizeImage = this.fullSizeContainer.querySelector('img');
		this.miniatures.forEach(miniature => this.addMiniature(miniature));
	}

	fullSizeImage: HTMLElement;
	currentMiniature: Miniature;

	addMiniature(miniature: Miniature) {
		this.miniatures.push(miniature);

		miniature.ref.addEventListener('mousemove', this.moveMagnifier.bind(this));

		miniature.ref.addEventListener('mouseenter', $event => {
			this.changeCurrentMiniature($event.target as HTMLElement);
		});

		miniature.ref.addEventListener('mouseleave', $event => {
			// Remove full size image
			this.changeFullSizeImage('');

			// Reset top and left styles from full size image
			this.resetFullSizeImageStyles();

			// Remove current miniature.
			this.currentMiniature = null;
		});
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
		const fullSizeImageBounding = this.fullSizeImage.getBoundingClientRect();

		// How many full size container is bigger than miniature container.
		const scale = Math.sqrt(
			(this.fullSizeImage.clientWidth * this.fullSizeImage.clientHeight) /
				(this.currentMiniature.ref.clientWidth *
					this.currentMiniature.ref.clientHeight)
		);

		// How far to move image relative to miniature.
		const vector = {
			x: -x * scale + containerBounding.width / 2,
			y: -y * scale + containerBounding.height / 2,
		};

		// Check if image doesn't leave empty spaces in X-axis.
		const canMoveXAxis =
			fullSizeImageBounding.width + vector.x > containerBounding.width &&
			vector.x < 0;

		// Check if image doesn't leave empty spaces in Y-axis.
		const canMoveYAxis =
			fullSizeImageBounding.height + vector.y > containerBounding.height &&
			vector.y < 0;

		if (canMoveYAxis)
			this.fullSizeImage.style.setProperty('top', `${vector.y}px`);
		if (canMoveXAxis)
			this.fullSizeImage.style.setProperty('left', `${vector.x}px`);
	}

	private changeFullSizeImage(src: string) {
		this.fullSizeImage.setAttribute('src', src);
	}

	private changeCurrentMiniature(newMiniature: HTMLElement) {
		// If new miniature is the same as current do nothing.
		if (this.currentMiniature && newMiniature === this.currentMiniature.ref)
			return;

		// Find new miniature in the array.
		const miniature = this.miniatures.find(
			miniature => miniature.ref === newMiniature
		);

		// Set new miniature as current.
		this.currentMiniature = miniature;

		// Display its full size representation.
		this.changeFullSizeImage(miniature.fullSizeImage);
	}

	private resetFullSizeImageStyles() {
		this.fullSizeImage.style.setProperty('left', '0px');
		this.fullSizeImage.style.setProperty('top', '0px');
	}
}

const miniatures: Miniature[] = [
	{
		ref: (document.querySelectorAll(
			'.magnifier__miniature'
		)[0] as any) as HTMLElement,
		fullSizeImage:
			'https://images.pexels.com/photos/148182/pexels-photo-148182.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
	},
	{
		ref: (document.querySelectorAll(
			'.magnifier__miniature'
		)[1] as any) as HTMLElement,
		fullSizeImage:
			'https://images.pexels.com/photos/814898/pexels-photo-814898.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
	},
];

const magnifier = new Magnifier(fullSizeImageContainer, miniatures);

magnifier.addMiniature({
	ref: (document.querySelectorAll(
		'.magnifier__miniature'
	)[2] as any) as HTMLElement,
	fullSizeImage:
		'https://images.pexels.com/photos/247376/pexels-photo-247376.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
});
