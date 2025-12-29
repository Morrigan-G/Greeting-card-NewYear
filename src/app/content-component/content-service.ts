import { Injectable } from "@angular/core";

export interface Page {
  title?: string;
  lines?: string[];
  images?: string[];
  backgroundColor: string;
  type: 'title' | 'accumulative' | 'images';
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private currentPageIndex = 0;
  private currentStep = 0;
  private currentImageIndex = 0; // сколько картинок показываем (0..N-1)
  private continueButtonClicked = false;
  private isSelecting = false;
  private selectedImageIndex = -1;
  private selectionFinished = false;

private pages: Page[] = [
  {
    title: 'Поздравленческая открытка !!!',
  backgroundColor: 'linear-gradient(135deg, #C7D2FE 0%, #EDE9FE 100%)',
  type: 'title'
  },
  {
    lines: [
      'С Новым 2026 Годом',
      'Желаю всего самого',
      'Много заслуг',
      'Здоровья и счастья',
      'Успехов в делах'
    ],
    backgroundColor: 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%)',
    type: 'accumulative'
  },
  {
    title: 'Нажми чтоб продолжить:',
  backgroundColor: 'linear-gradient(135deg, #C7D2FE 0%, #EDE9FE 100%)',
  type: 'title'
  },
  {
    images: [
      'https://images.unsplash.com/photo-1589965716319-4a041b58fa8a?q=80&w=1374&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400',
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400',
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400',
      'https://images.unsplash.com/photo-1617331140180-e8262094733a?q=80&w=776&auto=format&fit=crop'
    ],
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    type: 'images'
  },
  {
    title: 'Поздравляю!',
    backgroundColor: '#000000', // Начальный черный фон
    type: 'title'
  }
];

  // ——— getters ———
  getCurrentPage(): Page { return this.pages[this.currentPageIndex]; }
  getCurrentPageIndex(): number { return this.currentPageIndex; }

  getAllTexts(): string[] {
    if (this.currentPageIndex === 1) {
      return this.pages[1].lines!.slice(0, this.currentStep + 1);
    }
    return [];
  }

  getVisibleImages(): string[] {
    if (this.currentPageIndex === 3 && this.pages[3].images) {
      return this.pages[3].images.slice(0, this.currentImageIndex + 1);
    }
    return [];
  }

  getAllImagesCount(): number {
    const arr = this.pages[3]?.images;
    return Array.isArray(arr) ? arr.length : 0;
  }

  // ——— navigation buttons ———
  canGoNext(): boolean {
    return this.currentPageIndex === 1 &&
           this.currentStep < (this.pages[1].lines?.length ?? 0) - 1;
  }

  canGoBack(): boolean {
    return this.currentPageIndex === 1 && this.currentStep > 0;
  }

  canAddImage(): boolean {
    const imagesLen = this.getAllImagesCount();
    return this.currentPageIndex === 3 &&
           imagesLen > 0 &&
           this.currentImageIndex < imagesLen - 1;
  }

  // ——— continue / luck ———
  isContinueClicked(): boolean { return this.continueButtonClicked; }

  markContinueClicked(value: boolean = true): void {
    this.continueButtonClicked = value;
  }

  // ——— selection state ———
  isSelectingInProgress(): boolean { return this.isSelecting; }
  isSelectionFinished(): boolean { return this.selectionFinished; }
  getSelectedImageIndex(): number { return this.selectedImageIndex; }

  startSelecting(): void {
    this.isSelecting = true;
    this.selectedImageIndex = -1;
    this.selectionFinished = false;
  }

  finishSelecting(index: number): void {
    this.isSelecting = false;
    this.selectedImageIndex = index;
    this.selectionFinished = true;
  }

  // 🔑 расширенный сброс
  resetSelection(): void {
    this.isSelecting = false;
    this.selectedImageIndex = -1;
    this.selectionFinished = false;
    this.continueButtonClicked = false;
    this.currentImageIndex = 0;
  }

  // ——— progression ———
  goNext(): void { if (this.canGoNext()) this.currentStep++; }
  goBack(): void { if (this.canGoBack()) this.currentStep--; }
  addNextImage(): void { if (this.canAddImage()) this.currentImageIndex++; }

  showAllImages(): void {
    const imagesLen = this.getAllImagesCount();
    if (imagesLen > 0) this.currentImageIndex = imagesLen - 1;
  }

  goToNextPage(): void {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
      this.currentStep = 0;
      this.currentImageIndex = 0;
      this.resetSelection();
    }
  }

  showAccumulativeText(): boolean { return this.currentPageIndex === 1; }
}