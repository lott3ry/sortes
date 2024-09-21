import Modal from './Modal';

export interface PopupProps {
  clickModalClosable?: boolean;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  children?: React.ReactNode;
  closeSideEffect?: () => void;
}

export const Popup: React.FC<PopupProps> = ({
  clickModalClosable = true,
  visible,
  setVisible,
  children,
  closeSideEffect,
}) => {
  if (!visible) return null;
  return (
    <Modal
      clickClosable={clickModalClosable}
      onClose={() => {
        setVisible(false);
        closeSideEffect && closeSideEffect();
      }}
    >
      {children}
    </Modal>
  );
};
