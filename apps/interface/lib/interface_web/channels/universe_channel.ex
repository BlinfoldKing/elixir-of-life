defmodule InterfaceWeb.UniverseChannel do
  use Phoenix.Channel

  def join("universe", _params, socket) do
    {:ok, %{hello: "world"}, socket}
  end

  def handle_in("board:update", %{"board" => body},  socket) do
    [yhead | ytail] = body
    [_xhead | xtail]  = yhead
    broadcast!(socket, "board:update", %{"board" => [[true | xtail] | ytail]})
    {:reply, :ok, socket}
  end

end
