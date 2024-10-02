# shamelessly stolen from https://github.com/ciscou/expressionist

module Expressionist
  class UnaryOperatorNode
    def initialize(a, op)
      @a, @op = a, op
    end

    def to_f
      f = @a.to_f

      case @op
      when "+" then  f
      when "-" then -f
      end
    end

    def to_rpn
      rpn = @a.to_rpn

      case @op
      when "+" then  rpn
      when "-" then [rpn, "-1", "*"].join " "
      end
    end

    def to_tree(max_depth)
      max_width = 6 * 2 ** max_depth

      tree = [
        @op,
        "│",
        "│",
      ]
      tree += @a.to_tree(max_depth - 1).lines.map(&:chomp)

      tree.map { |s| s.center(max_width) }.join("\n")
    end

    def depth
      @a.depth + 1
    end
  end

  class BinaryOperatorNode
    def initialize(a, b, op)
      @a, @b, @op = a, b, op
    end

    def to_f
      f1, f2 = @a.to_f, @b.to_f

      case @op
      when "+" then f1 + f2
      when "-" then f1 - f2
      when "*" then f1 * f2
      when "/" then f1 / f2
      end
    end

    def to_rpn
      [@a.to_rpn, @b.to_rpn, @op].join " "
    end


    def to_tree(max_depth)
      max_width = 6 * 2 ** max_depth

      a_tree = @a.to_tree(max_depth - 1).lines.map(&:chomp)
      b_tree = @b.to_tree(max_depth - 1).lines.map(&:chomp)
      a_tree << nil while a_tree.length < b_tree.length

      ab_tree = a_tree.zip(b_tree).map do |a, b|
        a ||= " " * (max_width / 2)
        b ||= " " * (max_width / 2)

        [a, b].join
      end

      tree = [
        @op,
        "│",
        "┌#{"┴".center(max_width / 2 - 1, "─")}┐"
      ]
      tree += ab_tree
      tree.map { |s| s.center(max_width) }.join("\n")
    end

    def depth
      [@a.depth, @b.depth].max + 1
    end
  end

  class NumberNode
    def initialize(a)
      @a = a
    end

    def to_f
      @a.to_f
    end

    def to_rpn
      @a
    end

    def depth
      0
    end

    def to_tree(max_depth)
      max_width = 6 * 2 ** max_depth

      @a.center(max_width)
    end
  end

  class Parser
    def parse(input)
      @lexer = Lexer.new(input)

      @res = expression
      ensure_next_token_is! ""

      self
    end

    def to_f
      @res.to_f
    end

    def to_rpn
      @res.to_rpn
    end

    def to_tree
      @res.to_tree(@res.depth)
    end

    private

    def ensure_next_token_is!(expected)
      token = @lexer.next_token!

      Array(expected).include?(token) or raise "Unexpected token #{token.inspect}, expecting #{expected.inspect}"
    end

    def expression
      a = factor

      loop do
        token = @lexer.next_token!
        break unless ["+", "-"].include? token

        b = factor
        a = BinaryOperatorNode.new(a, b, token)
      end

      @lexer.undo!

      a
    end

    def factor
      a = number

      loop do
        token = @lexer.next_token!
        break unless ["*", "/"].include? token

        b = number
        a = BinaryOperatorNode.new(a, b, token)
      end

      @lexer.undo!

      a
    end

    def number
      token = @lexer.next_token!

      case token
      when "("
        expression.tap { ensure_next_token_is! ")" }
      when "+", "-"
        UnaryOperatorNode.new(number, token)
      when /\A[0-9]+(\.[0-9]+)?\z/
        NumberNode.new(token)
      else raise "Syntax error"
      end
    end
  end

  class Lexer
    def initialize(input)
      @input, @undo = input.dup, false
    end

    def next_token!
      if @undo
        @undo = false
        return @prev_token
      end

      @prev_token = extract_next_token!
    end

    def undo!
      @undo = true
    end

    private

    def extract_next_token!
      @input.lstrip!

      if @input.empty?
        @input
      elsif %w[+ - * / ( )].include? @input[0]
        @input.slice! 0
      else
        @input.slice! %r{\A[0-9]+(\.[0-9]+)?} or raise "Syntax error"
      end
    end
  end
end
