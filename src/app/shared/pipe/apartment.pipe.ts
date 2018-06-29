import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'apartmentStatusPipe'
})

export class ApartmentStatusPipe implements PipeTransform {
    transform(type: number): String {
        switch (type) {
            case 0:
                return "正常"
            case 1:
                return "封停";
        }
    }
}


@Pipe({
    name: 'floorPipe'
})

export class FloorPipe implements PipeTransform {
    transform(type: number): String {
        switch (type) {
            case 1:
                return "否";
            case 2:
                return "是";
        }
    }
}


