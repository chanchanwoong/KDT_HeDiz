export default function PaymentInfo({ label, value }) {
  return (
    <span className='text-color-secondary font-semibold text-sm'>
      <span className='inline-block w-3'>{label}</span>
      <span className='text-color'>{value}</span>
    </span>
  );
}
