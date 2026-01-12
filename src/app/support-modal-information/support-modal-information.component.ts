import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-support-modal-information',
  templateUrl: './support-modal-information.component.html',
  styleUrl: './support-modal-information.component.scss',
})
export class SupportModalInformationComponent {

  @Input() upstream_tasks;
  @Input() pending_task;
  isDragging = false;
  dragOffsetX = 0;
  dragOffsetY = 0;
  popupX = 300;
  popupY = 450;

  isReportOrParameters(value): boolean {
    if (value.length > 0) {
      return typeof value[0] === 'string';
    }
    return false;
  }

  onDrag(event: MouseEvent) {
    if (this.isDragging) {
      this.popupX = event.clientX - this.dragOffsetX;
      this.popupY = event.clientY - this.dragOffsetY;
    }
  }
  onDragStart(event: MouseEvent) {
    this.isDragging = true;
    this.dragOffsetX = event.clientX - this.popupX;
    this.dragOffsetY = event.clientY - this.popupY;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.popupX = event.clientX - this.dragOffsetX;
      this.popupY = event.clientY - this.dragOffsetY;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }
}
