import {
  Component,
  ChangeDetectorRef,
  NgZone,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NavigationService } from './content-service';
import { MaterialModule } from '../material/material-module';

@Component({
  selector: 'app-content-component',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatButtonModule],
  templateUrl: './content-component.html',
  styleUrls: ['./content-component.css']
})
export class ContentComponent implements AfterViewInit, OnInit, OnDestroy {
  currentHighlightIndex = -1;
  private animTimer: any = null;

  fadeOutOthers = false;
  isFinalCentered = false;
isTransitioningToCenter = false;
   // Для звезды
  showStarPoint = false;
  starClicked = false;
  isFlying = false;
  showFinalStar = false;
  showFinalMessage = false;
  showingStar = false;

 @ViewChildren('tiles') tiles!: QueryList<ElementRef>;

   constructor(
    public navigationService: NavigationService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (this.navigationService.getCurrentPageIndex() === 4) {
      this.navigationService.resetSelection();
      this.currentHighlightIndex = -1;
      this.fadeOutOthers = false;
      this.isFinalCentered = false;
       this.forceReset();
       console.log('PAGE INDEX:', this.navigationService.getCurrentPageIndex());
    }

     if (this.navigationService.getCurrentPageIndex() === 4) {
      setTimeout(() => {
        this.showStarPoint = true;
        this.cdr.detectChanges();
      }, 500); // Появляется раньше - через 0.5 секунды
    }
  }

  ngAfterViewInit(): void {}

  goNext(): void { this.navigationService.goNext(); }
  goBack(): void { this.navigationService.goBack(); }
  continue(): void { this.navigationService.goToNextPage();if (this.navigationService.getCurrentPageIndex() === 4) {
    this.prepareStarPage();
  } }
  addImage(): void { this.navigationService.addNextImage(); }
  
private prepareStarPage(): void {
  this.forceReset();

  setTimeout(() => {
    this.showStarPoint = true;
    this.cdr.detectChanges();
  }, 1200);
}
  onContinueOrLuck(): void {
    if (this.navigationService.isSelectingInProgress()) return;

    if (!this.navigationService.isContinueClicked()) {
      this.navigationService.markContinueClicked();
      this.cdr.detectChanges();
    } else if (!this.navigationService.isSelectionFinished()) {
      this.fadeOutOthers = false;
      this.isFinalCentered = false;
      this.currentHighlightIndex = -1;
      this.navigationService.resetSelection();
      this.cdr.detectChanges();

      this.navigationService.showAllImages();
      this.navigationService.startSelecting();
      this.cdr.detectChanges();

      setTimeout(() => {
        this.startLuckySelection();
      }, 300);
    }
  }

  startLuckySelection(): void {
    const totalImages = this.navigationService.getAllImagesCount();
    const targetIndex = 3;
    let step = 0;
    const totalSteps = 34;

    const safeIndex = (i: number) =>
      Math.max(0, Math.min(i % totalImages, totalImages - 1));

    const tick = () => {
      const index = safeIndex(step);
      this.currentHighlightIndex = index;
      this.cdr.detectChanges();

      if (step < totalSteps) {
        step++;
        const progress = step / totalSteps;
        let delay: number;

        if (progress < 0.5) delay = 200;
        else if (progress < 0.8) delay = 300 + (progress - 0.5) * 600;
        else delay = 500 + (progress - 0.8) * 1400;

        this.animTimer = setTimeout(tick, Math.round(delay));
      } else {
        this.finishAnimation(targetIndex);
      }
    };

    this.currentHighlightIndex = safeIndex(0);
    this.cdr.detectChanges();

    this.animTimer = setTimeout(tick, 320);
  }

  finishAnimation(targetIndex: number): void {
    if (this.animTimer) {
      clearTimeout(this.animTimer);
      this.animTimer = null;
    }

    const finalIndex = Math.max(0, Math.min(targetIndex, this.tiles.length - 1));
    this.currentHighlightIndex = finalIndex;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.navigationService.finishSelecting(finalIndex);
      this.navigationService.markContinueClicked(false);

      this.fadeOutOthers = true;

      this.isTransitioningToCenter = true;
    this.cdr.detectChanges();

      setTimeout(() => {
        this.isFinalCentered = true;
        this.cdr.detectChanges();
      }, 800);

      this.cdr.detectChanges();
    }, 420);
  }

  isHighlighted(index: number): boolean {
    return (
      this.currentHighlightIndex === index &&
      this.navigationService.isSelectingInProgress()
    );
  }

  isSelected(index: number): boolean {
    return (
      this.navigationService.getSelectedImageIndex() === index &&
      this.navigationService.isSelectionFinished()
    );
  }
getBackgroundStyle(): string {
  if (this.navigationService.getCurrentPageIndex() === 4) {
    return '';
  }
  return this.navigationService.getCurrentPage().backgroundColor;
}

onStarClick(): void {
    console.log('⭐ Звезда нажата!');
    
    this.starClicked = true;
    this.showingStar = true;
    this.cdr.detectChanges();
    
    // Фаза 1: Полет к экрану (2.5 секунды)
    setTimeout(() => {
      this.isFlying = true;
      this.cdr.detectChanges();
    }, 50);
    
    // Фаза 2: Превращение в звезду (через 2.5 сек)
    setTimeout(() => {
      this.isFlying = false;
      this.showFinalStar = true;
      this.cdr.detectChanges();
    }, 2550);
    
    // Фаза 3: Показываем новый текст (через 3.5 сек)
    setTimeout(() => {
      this.showFinalMessage = true;
      this.cdr.detectChanges();
    }, 3500);
  }

  private forceReset(): void {
    if (this.animTimer) {
      clearTimeout(this.animTimer);
      this.animTimer = null;
    }
    
    this.currentHighlightIndex = -1;
    this.fadeOutOthers = false;
    this.isFinalCentered = false;
    this.showStarPoint = false;
    this.starClicked = false;
    this.isFlying = false;
    this.showFinalStar = false;
    this.showFinalMessage = false;
    this.showingStar = false;
    
    this.navigationService.resetSelection();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.animTimer) {
      clearTimeout(this.animTimer);
      this.animTimer = null;
    }
  }
}