<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Auth;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\Printer;

class PrinterService
{
    protected Printer $printer;

    public function __construct(NetworkPrintConnector $connector)
    {
        $this->printer = new Printer($connector);
    }

    public function printReceipt($order)
    {
        try {
            $img = EscposImage::load(public_path('storage/images/logo.png'));
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            $this->printer->graphics($img);

            $this->printer->feed(1);
            $this->printer->setTextSize(2, 1);
            $this->printer->setEmphasis(true);
            $this->printer->text("Chairman Fried Chicken\n");
            $this->printer->setEmphasis(false);
            $this->printer->feed(1);
            $this->printer->setPrintLeftMargin(25);

            // === TRANSACTION INFO ===
            if (!empty($order)) {
                $this->printer->setTextSize(1, 1);
                $this->printer->setJustification(Printer::JUSTIFY_CENTER);
                $this->printer->text(strtoupper(env("BRANCH")) . "BRANCH" . "\n");
                $this->printer->feed(1);
                $this->printer->text("Receipt #: {$order['id']}\n");
                $this->printer->feed(1);
                $this->printer->setJustification(Printer::JUSTIFY_LEFT);
                $this->printer->text("Date: " . date('Y-m-d H:i:s') . "\n");
                $this->printer->text("Order Type: " . $order["order_type"] . "\n");
                $this->printer->text("Payment Method: " . $order["payment_method"] . "\n");
                $this->printer->text("Cashier: " . Auth::user()->name . "\n");
                $this->printer->feed(1);

                // === ITEM LIST ===
                if (isset($order["cart"])) {
                    $this->printer->setEmphasis(true);
                    $this->printer->text(str_pad("Item", 30) . str_pad("Qty", 5, ' ', STR_PAD_LEFT) . str_pad("Price", 10, ' ', STR_PAD_LEFT) . "\n");
                    $this->printer->setEmphasis(false);
                    $this->printer->text(str_repeat("-", 45) . "\n");

                    foreach ($order["cart"] as $item) {
                        $wrappedTitle = wordwrap($item['title'], 30, "\n");
                        $titleChunks = explode("\n", $wrappedTitle);
                        foreach ($titleChunks as $index => $chunk) {
                            if ($index === 0) {
                                $quantity = str_pad($item['quantity'], 5, ' ', STR_PAD_LEFT);
                                $price = str_pad(number_format($item['sale_price'] * $item['quantity'], 2), 10, ' ', STR_PAD_LEFT);
                                $this->printer->text(str_pad($chunk, 30) . $quantity . $price . "\n");
                            } else {
                                $this->printer->text("  " . $chunk . "\n");
                            }
                        }
                    }

                    $this->printer->text(str_repeat("-", 45) . "\n");
                }

                $this->printer->setEmphasis(true);
                $this->printer->text(str_pad("Total:", 39, " ", STR_PAD_BOTH) . "$" . number_format($order["total_price"], 2) . "\n");
                $this->printer->setEmphasis(false);
                $this->printer->feed(2);
            }

            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            $this->printer->text("Thank you for your purchase!\n");
            $this->printer->text("Visit us again at www.chairmanfood.shop\n");
            $this->printer->feed(3);

            $this->printer->cut();
        } catch (Exception $e) {
            // Optional: log error here
            throw new Exception("Printing failed: " . $e->getMessage());
        } finally {
            if (isset($this->printer)) {
                $this->printer->close(); // ✅ Always closes — no more "not finalized" error
            }
        }
    }
}
