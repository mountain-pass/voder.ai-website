import { gsap } from 'gsap';

// Local interfaces - will be extracted to @voder/shared later
export interface IAnimationService {
  execute(command: AnimationCommand): Promise<void>;
}

export interface AnimationCommand {
  type: 'fadeIn' | 'fadeOut' | 'slideIn' | 'slideOut' | 'custom';
  target: HTMLElement;
  config: AnimationConfig;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export class AnimationService implements IAnimationService {
  async execute(command: AnimationCommand): Promise<void> {
    const { type, target, config } = command;
    
    return new Promise((resolve) => {
      switch (type) {
        case 'fadeIn':
          gsap.fromTo(target, 
            { opacity: 0 }, 
            { 
              opacity: 1, 
              duration: config.duration,
              ease: config.easing,
              delay: config.delay || 0,
              onComplete: resolve
            }
          );
          break;
        
        case 'fadeOut':
          gsap.to(target, {
            opacity: 0,
            duration: config.duration,
            ease: config.easing,
            delay: config.delay || 0,
            onComplete: resolve
          });
          break;
          
        case 'slideIn':
          gsap.fromTo(target,
            { x: -100, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: config.duration,
              ease: config.easing,
              delay: config.delay || 0,
              onComplete: resolve
            }
          );
          break;
          
        default:
          resolve();
      }
    });
  }
}
