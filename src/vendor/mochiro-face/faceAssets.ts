/**
 * Emotion → face-document map, trimmed from mochiro-web to the handful of
 * faces the portfolio shows (regenerate with scripts/minify-faces.mjs).
 */

import type { FaceDocument } from "./face";

import DefaultEyes from "./faces/Default_eyes.json";
import IdleLoop from "./faces/Idle_loop.json";
import Blink from "./faces/Blink.json";
import Happy from "./faces/Happy.json";
import CuriosLoop from "./faces/Curios_loop.json";
import Love from "./faces/Love.json";

const doc = (d: unknown) => d as FaceDocument;

export const FACE_NEUTRAL = doc(DefaultEyes);
export const FACE_BLINK = doc(Blink);

const EMOTION_TO_FACE: Record<string, FaceDocument> = {
  neutral: doc(IdleLoop),
  happy: doc(Happy),
  curious: doc(CuriosLoop),
  love: doc(Love),
};

/** Resolve an emotion name to its face document (falls back to neutral eyes). */
export function faceForEmotion(emotion?: string | null): FaceDocument {
  if (!emotion) return FACE_NEUTRAL;
  return EMOTION_TO_FACE[emotion.toLowerCase().trim()] ?? FACE_NEUTRAL;
}
