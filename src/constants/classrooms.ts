/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClassroomOption {
  value: string;
  label: string;
  shortLabel: string;
  grade: number;
  room: number;
}

/**
 * รายการระดับชั้นห้องเรียนระดับมัธยมศึกษาตอนปลายครบถ้วนทุกห้อง:
 * ม.4/1 ถึง ม.4/13 (ม.4/1, ม.4/2, ..., ม.4/13)
 * ม.5/1 ถึง ม.5/13 (ม.5/1, ม.5/2, ..., ม.5/13)
 * ม.6/1 ถึง ม.6/13 (ม.6/1, ม.6/2, ..., ม.6/13)
 * รวม 39 ห้องเรียน เรียงลำดับตามระดับชั้นและห้องอย่างสมบูรณ์
 */
export const ALL_CLASSROOMS: ClassroomOption[] = [4, 5, 6].flatMap((grade) =>
  Array.from({ length: 13 }, (_, i) => {
    const room = i + 1;
    const roomCode = `ม.${grade}/${room}`;
    return {
      value: roomCode,
      label: roomCode,
      shortLabel: roomCode,
      grade,
      room,
    };
  })
);
